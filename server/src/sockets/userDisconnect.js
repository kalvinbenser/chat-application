const UserModel = require("../models/userModel");

module.exports = async (socket) => {
  try {
    const user = await UserModel.findOneAndUpdate(
      { socketId: socket.id },
      {
        $set: { isOnline: false },
      }
    );
  } catch (err) {
    console.error("Error handling disconnect:", err);
  }
};
