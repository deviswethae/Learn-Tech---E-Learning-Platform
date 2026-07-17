const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const http = require("http");
const { Server } = require("socket.io");
require("dotenv").config();

const { connection } = require("./db");
const { userRouter } = require("./routes/users.routes");
const { courseRoute } = require("./routes/courses.route");
const { videoRoute } = require("./routes/videos.route");
const jwt = require("jsonwebtoken");
const User = require("./models/users.models");
const { MessageModel } = require("./models/Message");
const { progressRoute } = require('./routes/progress.route');
const { statsRoute } = require('./routes/stats.route');
const { quizRoute } = require('./routes/quiz.route');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [
      "https://learn-tech-e-learning-platform-aq07ono6d-devi-swethas-projects.vercel.app",
      "https://learn-tech-e-learning-platform.vercel.app",
      "http://localhost:5173"
    ],
    credentials: true,
    methods: ["GET", "POST"],
  },
});

app.use(cors({
  origin: [
    "https://learn-tech-e-learning-platform.vercel.app",
    "http://localhost:5173"
  ],
  credentials: true
}));
app.use(express.json());

// Routes
app.use("/users", userRouter);
app.use("/courses", courseRoute);
app.use("/videos", videoRoute);
app.use('/progress', progressRoute);
app.use('/stats', statsRoute);
app.use('/quiz', quizRoute);

// Store connected users
const activeUsers = new Map();

// Socket.io connection handler
io.on("connection", (socket) => {
  console.log("New connection:", socket.id);

  // Authenticate user
  socket.on("authenticate", async (token) => {
    try {
      const decoded = jwt.verify(token, "LearnTech");
      const user = await User.UserModel.findById(decoded.userId).select("name role image");

      if (user) {
        // Store user in active users map
        activeUsers.set(socket.id, {
          id: user._id,
          name: user.name,
          role: user.role,
          avatar: user.image || "/default-avatar.png",
          socketId: socket.id
        });

        // Send authentication success to client
        socket.emit("authenticated", {
          userId: user._id,
          name: user.name,
          role: user.role,
          avatar: user.image || "/default-avatar.png"
        });

        // Notify all users about new connection
        io.emit("userConnected", {
          userId: user._id,
          name: user.name,
          role: user.role,
          avatar: user.image || "/default-avatar.png"
        });

        console.log(`${user.name} (${user.role}) connected`);
      }
    } catch (error) {
      console.log("Authentication failed:", error.message);
      socket.emit("authenticationError", { message: "Invalid token" });
    }
  });

  // Handle new messages
  socket.on("sendMessage", async (messageData) => {
    const user = activeUsers.get(socket.id);
    if (user) {
      try {
        // Create and save message to database
        const newMessage = new MessageModel({
          sender: user.id,
          content: messageData.text,
          timestamp: new Date(),
          chatType: messageData.chatType || 'private',
          status: 'sent'
        });

        const savedMessage = await newMessage.save();

        // Populate sender details
        const messageWithSender = {
          _id: savedMessage._id,
          sender: {
            _id: user.id,
            name: user.name,
            avatar: user.avatar,
            role: user.role
          },
          content: savedMessage.content,
          timestamp: savedMessage.timestamp,
          status: 'delivered',
          chatType: savedMessage.chatType
        };

        // Broadcast message to all connected clients
        io.emit("receiveMessage", messageWithSender);
      } catch (error) {
        console.error("Error saving message:", error);
      }
    }
  });

  // Handle message read receipts
  socket.on("messageRead", (messageId) => {
    const user = activeUsers.get(socket.id);
    if (user) {
      io.emit("updateMessageStatus", {
        messageId,
        status: 'read',
        readBy: user.id
      });
    }
  });

  // Load previous messages
  socket.on("requestPreviousMessages", async () => {
    try {
      const messages = await MessageModel.find()
        .sort({ timestamp: -1 })
        .limit(50)
        .populate('sender', 'name image role')
        .exec();

      socket.emit("previousMessages", messages.reverse());
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    const user = activeUsers.get(socket.id);
    if (user) {
      activeUsers.delete(socket.id);
      io.emit("userDisconnected", { userId: user.id });
      console.log(`${user.name} disconnected`);
    }
  });
});

// Start server
server.listen(process.env.PORT || 5000, async () => {
  try {
    await connection;
    console.log(`Connected to DB`);
    console.log(`Server running on port ${process.env.PORT || 5000}`);
  } catch (error) {
    console.log(`Error: ${error}`);
  }
});