const authService = require("../services/authService");

const register = async (req, res) => {
  try {
    const rb = req.body;
    const result = await authService.register(rb);

    if (!result.success) {
      return res.status(400).json({ success: false, message: result.message });
    }

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: result.data,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const login = async (req, res) => {
  try {
    const rb = req.body;
    const result = await authService.login(rb);

    if (!result.success) {
      return res.status(400).json({ success: false, message: result.message });
    }

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: result.data,
      token: result.token,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const profile = async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await authService.profile(userId);

    if (!result.success) {
      return res.status(400).json({ success: false, message: result.message });
    }

    res.status(200).json({
      success: true,
      data: result.data,
      token: result.token,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getAllUser = async (req, res) => {
  try {
    const userId= req.user.id
    const result = await authService.getAllUser(userId);

    if (!result.success) {
      return res.status(400).json({ success: false, message: result.message });
    }

    res.status(200).json({
      success: true,
      data: result.data,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { register, login, profile, getAllUser };
