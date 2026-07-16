const express = require('express');
const { ProgressModel } = require('../models/progress.model');
const courseModel = require('../models/courses.model');
const { UserModel } = require('../models/users.models');
const { auth } = require('../middlewares/users.middleware');

const progressRoute = express.Router();
progressRoute.use(auth); // req.body.userId/role come from the token after this

// GET /progress/summary
// One call, returns every enrolled course with watched/total/percent/completed
// (replaces the N+1 fetch loop currently in CourseProgressLedger.jsx)
progressRoute.get('/summary', async (req, res) => {
  try {
    const userId = req.body.userId;
    const user = await UserModel.findById(userId).populate({
      path: 'course',
      populate: { path: 'videos' }
    });
    if (!user) return res.status(404).json({ message: 'user not found' });

    const progresses = await ProgressModel.find({ userId });
    const progressMap = {};
    progresses.forEach((p) => (progressMap[p.courseId.toString()] = p));

    const summary = user.course.map((course) => {
      const total = course.videos.length;
      const p = progressMap[course._id.toString()];
      const watched = p ? p.watchedVideos.length : 0;
      const percent = total ? Math.round((watched / total) * 100) : 0;
      return { course, total, watched, percent, completed: p ? p.completed : false };
    });

    res.status(200).json({ summary });
  } catch (err) {
    res.status(400).json({ message: 'Something Went Wrong', error: err.message });
  }
});

// POST /progress/markWatched   body: { courseId, videoId }
// Call this when a video finishes playing (or a "mark complete" button is clicked)
progressRoute.post('/markWatched', async (req, res) => {
  try {
    const userId = req.body.userId;
    const { courseId, videoId } = req.body;

    let progress = await ProgressModel.findOne({ userId, courseId });
    if (!progress) {
      progress = new ProgressModel({ userId, courseId, watchedVideos: [] });
    }
    if (!progress.watchedVideos.some((v) => v.toString() === videoId)) {
      progress.watchedVideos.push(videoId);
    }

    const course = await courseModel.findById(courseId);
    const total = course?.videos?.length || 0;

    if (total > 0 && progress.watchedVideos.length >= total) {
      progress.completed = true;
      progress.completedAt = progress.completedAt || new Date();
    }

    await progress.save();
    const percent = total ? Math.round((progress.watchedVideos.length / total) * 100) : 0;

    res.status(200).json({
      message: 'Progress updated',
      watched: progress.watchedVideos.length,
      total,
      percent,
      completed: progress.completed
    });
  } catch (err) {
    res.status(400).json({ message: 'Something Went Wrong', error: err.message });
  }
});

// GET /progress/:courseId  -> single course, current logged-in user
progressRoute.get('/:courseId', async (req, res) => {
  try {
    const userId = req.body.userId;
    const { courseId } = req.params;
    const progress = await ProgressModel.findOne({ userId, courseId });
    const course = await courseModel.findById(courseId);
    const total = course?.videos?.length || 0;
    const watched = progress ? progress.watchedVideos.length : 0;
    const percent = total ? Math.round((watched / total) * 100) : 0;

    res.status(200).json({
      watchedVideos: progress ? progress.watchedVideos : [],
      total,
      watched,
      percent,
      completed: progress ? progress.completed : false
    });
  } catch (err) {
    res.status(400).json({ message: 'Something Went Wrong', error: err.message });
  }
});

module.exports = { progressRoute };