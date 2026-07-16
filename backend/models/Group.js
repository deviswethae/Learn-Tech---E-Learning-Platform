// models/Group.js
const mongoose = require("mongoose");

const GroupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: String,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true
  },
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "user"
  }],
  admins: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "user"
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  avatar: String
}, {
  versionKey: false,
  timestamps: true
});

const GroupModel = mongoose.model("Group", GroupSchema);
module.exports = { GroupModel };