const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'course', required: true },
    userName: { type: String },
    courseTitle: { type: String },
    score: { type: Number, required: true },
    totalQuestions: { type: Number, required: true },
    percent: { type: Number, required: true },
    issuedAt: { type: Date, default: Date.now },
    certificateId: { type: String, required: true, unique: true },
  },
  { versionKey: false }
);

certificateSchema.index({ userId: 1, courseId: 1 }, { unique: true });

module.exports = mongoose.model('certificate', certificateSchema);