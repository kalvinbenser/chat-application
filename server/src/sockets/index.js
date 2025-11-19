const authMiddleware = require("./authMiddleware");
const updateUserSocketId = require("./updateUserSocketId");
const userDisconnect = require("./userDisconnect");
const sendMessageSocket = require("./chat/sentMessage");

module.exports = (io) => {
  io.use(authMiddleware);
  io.on("connection", (socket) => {
    console.log(`New connection: ${socket.id}`);
    updateUserSocketId(socket);

    socket.on("join_room", (room) => {
      socket.join(room);
    });

    socket.on("send_message", (payload) =>
      sendMessageSocket(io, socket, payload)
    );

    socket.on("disconnect", () => {
      console.log(`Disconnected: ${socket.id}`);
      userDisconnect(socket);
    });
  });
};
