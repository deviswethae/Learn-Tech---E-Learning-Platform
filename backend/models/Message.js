const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
  sender: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "user", 
    required: true 
  },
  content: { 
    type: String, 
    required: true,
    trim: true 
  },
  timestamp: { 
    type: Date, 
    default: Date.now 
  },
  status: {
    type: String,
    enum: ['sent', 'delivered', 'read'],
    default: 'sent'
  },
  readBy: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user"
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  chatType: {
    type: String,
    enum: ['private', 'group'],
    default: 'private'
  }
}, { 
  versionKey: false,
  timestamps: true 
});

MessageSchema.index({ sender: 1 });
MessageSchema.index({ timestamp: -1 });

const MessageModel = mongoose.model("Message", MessageSchema);
module.exports = { MessageModel };