const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { ServerApiVersion } = require("mongodb");
const { userRoutes } = require("./routes/userRoutes");
const messagesRoute = require("./routes/messagesRoute");
const socket = require("socket.io");

const app = express();
require("dotenv").config();

app.use(cors());
app.use(express.json());

app.use("/api/auth", userRoutes);
app.use("/api/messages", messagesRoute);

// Updated Mongoose connection without deprecated options
mongoose
  .connect(process.env.MONGO_URL, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  })
  .then(() => {
    console.log("DB Connection Successful");
  })
  .catch((err) => {
    console.log("MongoDB Connection Error:", err.message);
  });

// Graceful shutdown (optional)
process.on("SIGINT", async () => {
  console.log("Shutting down server...");
  await mongoose.disconnect(); // Close Mongoose connection
  server.close(() => {
    console.log("Server closed");
    process.exit(0);
  });
});

// Server listening
const server = app.listen(process.env.PORT, () => {
  console.log(`Server Started on Port ${process.env.PORT}`);
});

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ error: "Something went wrong!" });
});

const io = socket(server, {
  cors: {
    orgin: "http://localhost:3000",
    credentials: true,
  },
});

global.onlineUsers = new Map();

io.on("connection", (socket) => {
  global.chatSocket = socket;
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
  });
  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-recieve", data.message);
    }
  });
});
