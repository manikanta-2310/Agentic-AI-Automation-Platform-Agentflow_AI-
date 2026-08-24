const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('../config');

function generateToken(user) {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role
    },
    config.JWT_SECRET,
    { expiresIn: config.JWT_EXPIRES_IN }
  );
}

async function register({ name, email, password, role }) {
  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    const error = new Error('An account with this email already exists');
    error.statusCode = 400;
    error.code = 'EMAIL_ALREADY_EXISTS';
    throw error;
  }

  const user = await User.create({
    name,
    email: email.toLowerCase(),
    password,
    role: role || 'operator'
  });

  const token = generateToken(user);

  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt
    },
    token
  };
}

async function login({ email, password }) {
  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
  if (!user) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    error.code = 'INVALID_CREDENTIALS';
    throw error;
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    error.code = 'INVALID_CREDENTIALS';
    throw error;
  }

  user.lastLogin = new Date();
  await user.save();

  const token = generateToken(user);

  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      lastLogin: user.lastLogin,
      createdAt: user.createdAt
    },
    token
  };
}

async function getMe(userId) {
  const user = await User.findById(userId);
  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    error.code = 'USER_NOT_FOUND';
    throw error;
  }

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    lastLogin: user.lastLogin,
    createdAt: user.createdAt
  };
}

module.exports = {
  register,
  login,
  getMe
};
