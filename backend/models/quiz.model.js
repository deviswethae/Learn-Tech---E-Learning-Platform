const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: { type: [String], required: true },
  answer: { type: String, required: true }, // must match one of the options
});

const quizSchema = new mongoose.Schema(
  {
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'course', required: true, unique: true },
    teacherId: { type: mongoose.Schema.Types.ObjectId, required: true },
    questions: [questionSchema],
  },
  { versionKey: false, timestamps: true }
);

module.exports = mongoose.model('quiz', quizSchema);