const messageService = require("../services/messageService");

const getAllMessages = async (req, res) => {
  try {
    const userId = req.user.id;
    const selectedUserId = req.params.id;
    const result = await messageService.getAllMessages(userId, selectedUserId);

    if (!result.success) {
      return res.status(400).json({ success: false, message: result.message });
    }

    res.status(200).json({ success: true, data: result.data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getAllMessages };
