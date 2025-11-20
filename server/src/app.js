require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const connectDB = require("./db/db");
const initiateSocket = require("./sockets/index");
const authRoutes = require("./routes/authRoutes");
const messageRoutes = require("./routes/messageRoutes");
const app = express();
const server = http.createServer(app);

connectDB();
app.use(cors());
app.use(express.json());
app.use("/user", authRoutes);
app.use("/user/message", messageRoutes);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on ${PORT}`));

const io = new Server(server, {
  cors: {
    origin: "*",
    credentials: true,
  },
});

app.set('io',io)

initiateSocket(io);
