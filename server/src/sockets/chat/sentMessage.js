const MessageModel = require("../../models/messageModel");
const UserModel = require("../../models/userModel");
const { encryptMessage, decryptMessage } = require("../../utils/cryptoUtils");

module.exports = async (io, socket, payload) => {
  try {
    const { toUserId, message } = payload;
    const fromUserId = socket.user.id;

    if (!message || !toUserId) {
      return socket.emit("send_message:error", {
        status: 400,
        message: "Message and toUserId are required.",
      });
    }

    const encrypted = encryptMessage(message);

    const chat = await MessageModel.create({
      toUserId,
      fromUserId,
      contentEncrypted: encrypted.encryptedData,
      iv: encrypted.iv,
      authTag: encrypted.authTag,
    });

    const receiverData = await UserModel.findById(toUserId);

    if (!receiverData || !receiverData.socketId) {
      return socket.emit("send_message:error", {
        status: 400,
        message: "Receiver not found.",
      });
    }

    const decryptedMessage = decryptMessage(
      chat.contentEncrypted,
      chat.iv,
      chat.authTag
    );

    const messageData = {
      _id: chat._id,
      fromUserId: chat.fromUserId,
      toUserId: chat.toUserId,
      message: decryptedMessage,
      createdAt: chat.createdAt,
    };

    // Emit to receiver
    io.to(receiverData.socketId).emit("receive_message", messageData);
  } catch (error) {
    console.log("Send Message Error:", error);
    socket.emit("send_message:error", {
      status: 500,
      message: "Internal server problem.",
    });
  }
};
