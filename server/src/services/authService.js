const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const UserModel = require("../models/userModel");

const register = async (payload) => {
  try {
    const { name, email, password } = payload;

    if (!email || !password) {
      return { success: false, message: "Email & Password are required" };
    }

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return { success: false, message: "Email already registered" };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await UserModel.create({
      name,
      email,
      password: hashedPassword,
    });

    return {
      success: true,
      data: user,
      message: "User registered successfully",
    };
  } catch (err) {
    return { success: false, message: err.message };
  }
};

const login = async (paylaod) => {
  try {
    const { email, password } = paylaod;

    if (!email || !password) {
      return { success: false, message: "Email & Password required" };
    }

    const user = await UserModel.findOne({ email });

    if (!user) {
      return { success: false, message: "User not found" };
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return { success: false, message: "Invalid password" };
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRY }
    );

    return {
      success: true,
      data: user,
      token,
      message: "User logged in successfully",
    };
  } catch (err) {
    return { success: false, message: err.message };
  }
};

const profile = async (userId) => {
  try {
    const user = await UserModel.findById(userId);

    return {
      success: true,
      data: user,
    };
  } catch (err) {
    return { success: false, message: err.message };
  }
};

const getAllUser = async (userId) => {
  try {
    const user = await UserModel.find({ _id: { $ne: userId } });

    return {
      success: true,
      data: user,
    };
  } catch (err) {
    return { success: false, message: err.message };
  }
};

module.exports = { register, login, profile, getAllUser };
