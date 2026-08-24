const authService = require('../services/authService');

async function register(req, res, next) {
  try {
    const { name, email, password, role } = req.body;
    const result = await authService.register({ name, email, password, role });
    res.status(201).json({
      success: true,
      message: 'Account registered successfully',
      data: result
    });
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const result = await authService.login({ email, password });
    res.status(200).json({
      success: true,
      message: 'Authentication successful',
      data: result
    });
  } catch (err) {
    next(err);
  }
}

async function getMe(req, res, next) {
  try {
    const user = await authService.getMe(req.user.id);
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  register,
  login,
  getMe
};
