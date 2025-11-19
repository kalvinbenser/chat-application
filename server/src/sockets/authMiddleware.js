const jwt = require("jsonwebtoken");

module.exports = async (socket, next) => {
  try {
    const token =
      socket.handshake.headers.authorization || socket.handshake.auth.token;

    if (!token) {
      socket.emit("error", {
        status: 400,
        message: "Invalid token.",
      });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      socket.emit("error", {
        status: 400,
        message: "Invalid token.",
      });
    }
    socket.user = decoded;
    next();
  } catch (err) {
    console.error("Authentication error", err);
  }
};
