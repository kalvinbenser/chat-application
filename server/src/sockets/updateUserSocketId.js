const UserModel = require("../models/userModel");
module.exports = async (socket) => {
  try {
    const user = await UserModel.findByIdAndUpdate(
      socket.user.id,
      {
        isOnline: true,
        socketId: socket.id,
      },
      { new: true }
    );
  } catch (err) {
    console.error("err", err);
  }
};
