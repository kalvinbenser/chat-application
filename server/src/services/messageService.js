const { Types } = require("mongoose");
const MessageModel = require("../models/messageModel");
const { decryptMessage } = require("../utils/cryptoUtils");

const getAllMessages = async (userId, selectedUserId) => {
  try {
    if (!Types.ObjectId.isValid(selectedUserId)) {
      return { success: false, message: "Invalid user ID" };
    }

    const objectId = new Types.ObjectId(userId);

    const messages = await MessageModel.find({
      $or: [
        {
          fromUserId: new Types.ObjectId(userId),
          toUserId: new Types.ObjectId(selectedUserId),
        },
        {
          fromUserId: new Types.ObjectId(selectedUserId),
          toUserId: new Types.ObjectId(userId),
        },
      ],
    }).sort({ createdAt: 1 });

    const decryptedMessages = messages.map((msg) => {
      let messageText = "";

      try {
        messageText = decryptMessage(msg.contentEncrypted, msg.iv, msg.authTag);
      } catch (err) {
        messageText = "[Unable to decrypt message]";
      }

      return {
        _id: msg._id,
        fromUserId: msg.fromUserId,
        toUserId: msg.toUserId,
        message: messageText,
        createdAt: msg.createdAt,
      };
    });

    return {
      success: true,
      data: decryptedMessages,
      message: "Messages retrieved successfully",
    };
  } catch (err) {
    return { success: false, message: err.message };
  }
};

module.exports = { getAllMessages };
