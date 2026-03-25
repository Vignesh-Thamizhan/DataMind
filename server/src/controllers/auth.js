const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });

exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;

  if (!email || !password) {
    return next(new AppError("Email and password are required", 400));
  }

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    return next(new AppError("Email already in use", 409));
  }

  const hashed = await bcrypt.hash(password, 12);
  const user = await User.create({ name: name || "", email, password: hashed });

  const token = signToken(user._id);

  res.status(201).json({
    success: true,
    token,
    user: { _id: user._id, name: user.name, email: user.email },
  });
});

exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError("Email and password are required", 400));
  }

  const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
  if (!user) {
    return next(new AppError("Invalid email or password", 401));
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return next(new AppError("Invalid email or password", 401));
  }

  const token = signToken(user._id);

  res.json({
    success: true,
    token,
    user: { _id: user._id, name: user.name, email: user.email },
  });
});

exports.me = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  if (!user) return next(new AppError("User not found", 404));
  res.json({ success: true, user: { _id: user._id, name: user.name, email: user.email } });
});