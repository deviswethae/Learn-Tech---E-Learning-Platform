const express = require('express');
const QuizModel = require('../models/quiz.model');
const CertificateModel = require('../models/certificate.model');
const { ProgressModel } = require('../models/progress.model');
const courseModel = require('../models/courses.model');
const { UserModel } = require('../models/users.models');
const { auth } = require('../middlewares/users.middleware');

const quizRoute = express.Router();
quizRoute.use(auth);

// Teacher/Admin — create or replace the quiz for a course
// POST /quiz/add/:courseId  body: { questions: [{question, options:[..], answer}] }
quizRoute.post('/add/:courseId', async (req, res) => {
  try {
    if (req.body.role !== 'admin' && req.body.role !== 'teacher') {
      return res.status(401).json({ error: "you don't have access to add a quiz" });
    }
    const { courseId } = req.params;
    const { questions } = req.body;

    if (!Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ message: 'At least one question is required' });
    }
    for (const q of questions) {
      if (!q.question || !Array.isArray(q.options) || q.options.length < 2 || !q.answer) {
        return res.status(400).json({ message: 'Each question needs text, options, and an answer' });
      }
      if (!q.options.includes(q.answer)) {
        return res.status(400).json({ message: `Answer must match one of the options for: "${q.question}"` });
      }
    }

    const course = await courseModel.findById(courseId);
    if (!course) return res.status(404).json({ message: 'course not found' });

    if (req.body.role === 'teacher' && course.teacherId.toString() !== req.body.userId) {
      return res.status(401).json({ error: "you don't have access to this course's quiz" });
    }

    const quiz = await QuizModel.findOneAndUpdate(
      { courseId },
      { courseId, teacherId: course.teacherId, questions },
      { new: true, upsert: true }
    );

    res.status(201).json({ message: 'Quiz saved', quiz });
  } catch (err) {
    res.status(400).json({ message: 'Something Went Wrong', error: err.message });
  }
});

// Teacher/Admin — view quiz WITH correct answers, for editing
// GET /quiz/manage/:courseId
quizRoute.get('/manage/:courseId', async (req, res) => {
  try {
    if (req.body.role !== 'admin' && req.body.role !== 'teacher') {
      return res.status(401).json({ error: "you don't have access to this quiz" });
    }
    const quiz = await QuizModel.findOne({ courseId: req.params.courseId });
    res.status(200).json({ quiz: quiz || null });
  } catch (err) {
    res.status(400).json({ message: 'Something Went Wrong', error: err.message });
  }
});

// Student — fetch quiz WITHOUT answers, gated behind 100% video progress
// GET /quiz/:courseId
quizRoute.get('/:courseId', async (req, res) => {
  try {
    const userId = req.body.userId;
    const { courseId } = req.params;

    const progress = await ProgressModel.findOne({ userId, courseId });
    if (!progress || !progress.completed) {
      return res.status(403).json({ message: 'Finish all videos before taking the quiz' });
    }

    const quiz = await QuizModel.findOne({ courseId });
    if (!quiz) return res.status(404).json({ message: 'No quiz has been added for this course yet' });

    const questions = quiz.questions.map((q) => ({
      _id: q._id,
      question: q.question,
      options: q.options,
    }));

    const existingCertificate = await CertificateModel.findOne({ userId, courseId });

    res.status(200).json({ questions, alreadyCertified: !!existingCertificate });
  } catch (err) {
    res.status(400).json({ message: 'Something Went Wrong', error: err.message });
  }
});

// Student — submit answers, auto-score, auto-issue certificate at >=75%
// POST /quiz/submit/:courseId  body: { answers: [{questionId, selected}] }
quizRoute.post('/submit/:courseId', async (req, res) => {
  try {
    const userId = req.body.userId;
    const { courseId } = req.params;
    const { answers } = req.body;

    const progress = await ProgressModel.findOne({ userId, courseId });
    if (!progress || !progress.completed) {
      return res.status(403).json({ message: 'Finish all videos before taking the quiz' });
    }

    const quiz = await QuizModel.findOne({ courseId });
    if (!quiz) return res.status(404).json({ message: 'No quiz found for this course' });

    const answerMap = {};
    (answers || []).forEach((a) => (answerMap[a.questionId] = a.selected));

    let correct = 0;
    quiz.questions.forEach((q) => {
      if (answerMap[q._id.toString()] === q.answer) correct += 1;
    });

    const total = quiz.questions.length;
    const percent = total ? Math.round((correct / total) * 100) : 0;
    const passed = percent >= 75;

    let certificate = null;
    if (passed) {
      const course = await courseModel.findById(courseId);
      const user = await UserModel.findById(userId);
      const certificateId = `LT-${courseId.toString().slice(-6).toUpperCase()}-${userId.toString().slice(-6).toUpperCase()}`;

      certificate = await CertificateModel.findOneAndUpdate(
        { userId, courseId },
        {
          userId,
          courseId,
          score: correct,
          totalQuestions: total,
          percent,
          certificateId,
          userName: user?.name,
          courseTitle: course?.title,
        },
        { new: true, upsert: true }
      );
    }

    res.status(200).json({ score: correct, total, percent, passed, certificate });
  } catch (err) {
    res.status(400).json({ message: 'Something Went Wrong', error: err.message });
  }
});

// Student — fetch existing certificate for a course
// GET /quiz/certificate/:courseId
quizRoute.get('/certificate/:courseId', async (req, res) => {
  try {
    const userId = req.body.userId;
    const certificate = await CertificateModel.findOne({ userId, courseId: req.params.courseId });
    res.status(200).json({ certificate: certificate || null });
  } catch (err) {
    res.status(400).json({ message: 'Something Went Wrong', error: err.message });
  }
});

// Student — all certificates earned (for a future "My Certificates" page)
// GET /quiz/certificates/mine
quizRoute.get('/certificates/mine', async (req, res) => {
  try {
    const certificates = await CertificateModel.find({ userId: req.body.userId }).populate('courseId');
    res.status(200).json({ certificates });
  } catch (err) {
    res.status(400).json({ message: 'Something Went Wrong', error: err.message });
  }
});

module.exports = { quizRoute };