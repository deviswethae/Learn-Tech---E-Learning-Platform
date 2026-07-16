const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'course', required: true },
  watchedVideos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'videos' }],
  completed: { type: Boolean, default: false },
  completedAt: { type: Date }
}, { versionKey: false, timestamps: true });

// one progress doc per user per course
progressSchema.index({ userId: 1, courseId: 1 }, { unique: true });

const ProgressModel = mongoose.model('progress', progressSchema);
module.exports = { ProgressModel };