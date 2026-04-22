const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
  register,
  verifyOTP,
  login,
  addRole,
  switchRole,
  getMe
} = require('../controllers/authController');

router.post('/register', register);
router.post('/verify-otp', verifyOTP);
router.post('/login', login);

router.patch('/add-role', authMiddleware, addRole);
router.patch('/switch-role', authMiddleware, switchRole);
router.get('/me', authMiddleware, getMe);

module.exports = router;
