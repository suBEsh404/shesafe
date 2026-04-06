const asyncHandler = require('../utils/asyncHandler');
const authService = require('../services/authService');

const register = asyncHandler(async (req, res) => {
  const result = await authService.registerUser(req.body);
  res.status(201).json({
    success: true,
    message: 'Registration successful',
    data: result
  });
});

const login = asyncHandler(async (req, res) => {
  const result = await authService.loginUser(req.body);
  res.status(200).json({
    success: true,
    message: 'Login successful',
    data: result
  });
});

const refresh = asyncHandler(async (req, res) => {
  const result = await authService.refreshTokens(req.body.refreshToken);
  res.status(200).json({
    success: true,
    message: 'Token refreshed',
    data: result
  });
});

const logout = asyncHandler(async (req, res) => {
  const result = await authService.logoutUser(req.body.refreshToken);
  res.status(200).json({
    success: true,
    message: 'Logout successful',
    data: result
  });
});

module.exports = {
  register,
  login,
  refresh,
  logout
};
