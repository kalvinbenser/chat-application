const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
    },
    contentEncrypted: {
      type: String,
      required: true,
    },
    iv: { type: String, required: true },
    authTag: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Message", MessageSchema);
