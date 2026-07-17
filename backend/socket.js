const io = require("socket.io")(5000, { 
  cors: { origin: "https://learn-tech-e-learning-platform-aq07ono6d-devi-swethas-projects.vercel.app" },
});

const users = {}; // Store connected users

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("authenticate", (data) => {
    users[socket.id] = data.username; // Store username
    console.log(`${data.username} authenticated and connected`);
  });

  socket.on("message", (msg) => {
    const username = users[socket.id] || "Anonymous"; // Get stored username
    io.emit("message", { user: username, text: msg });
  });

  socket.on("disconnect", () => {
    console.log(`User ${users[socket.id] || "Unknown"} disconnected`);
    delete users[socket.id]; // Remove user from storage
  });
});
