const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { sendOTP, generateOTP } = require('../utils/emailService');

const register = async (req, res) => {
  try {
    const { name, email, password, roles } = req.body;

    if (!name || !email || !password || !roles || roles.length === 0) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    // if (!email.endsWith('@lpu.in')) {
    //   return res.status(400).json({ message: 'Only @lpu.in emails are allowed.' });
    // }

    if (roles.length > 2) {
      return res.status(400).json({ message: 'Maximum 2 roles allowed.' });
    }

    const unqRoles = new Set(roles);
    if (unqRoles.size !== roles.length) {
      return res.status(400).json({ message: 'Duplicate roles are not allowed.' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      // If user exists and is verified
      if (existingUser.isVerified) {
        return res.status(400).json({ message: 'User already exists and is verified. Please log in.' });
      }
      // If user exists but is not verified, we can resend OTP and update fields
      const otp = generateOTP();
      const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 mins
      existingUser.otp = otp;
      existingUser.otpExpiry = otpExpiry;
      const hashedPassword = await bcrypt.hash(password, 10);
      existingUser.password = hashedPassword;
      existingUser.name = name;
      existingUser.roles = roles;
      existingUser.currentRole = roles[0];
      await existingUser.save();
      try {
  await sendOTP(email, otp);
} catch (err) {
  console.log("⚠️ Email failed:", err.message);
}
      return res.status(200).json({ message: 'OTP sent to registered email for verification.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 mins

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      roles,
      currentRole: roles[0],
      otp,
      otpExpiry
    });

    await newUser.save();
    try {
  await sendOTP(email, otp);
} catch (err) {
  console.log("⚠️ Email failed:", err.message);
}

    res.status(201).json({ message: 'User registered successfully. Verify OTP to complete registration.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP are required.' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: 'User already verified. Please log in.' });
    }

    if (user.otp !== otp || user.otpExpiry < new Date()) {
      return res.status(400).json({ message: 'Invalid or expired OTP.' });
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    const token = jwt.sign(
      { id: user._id, roles: user.roles, currentRole: user.currentRole },
      process.env.JWT_SECRET || 'super_secret_jwt_key_here',
      { expiresIn: '7d' }
    );

    res.status(200).json({
      message: 'OTP verified successfully.',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        roles: user.roles,
        currentRole: user.currentRole
      }
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    if (!user.isVerified) {
      return res.status(403).json({ message: 'Please verify your email first.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    const token = jwt.sign(
      { id: user._id, roles: user.roles, currentRole: user.currentRole },
      process.env.JWT_SECRET || 'super_secret_jwt_key_here',
      { expiresIn: '7d' }
    );

    res.status(200).json({
      message: 'Logged in successfully.',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        roles: user.roles,
        currentRole: user.currentRole
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const addRole = async (req, res) => {
  try {
    const { newRole } = req.body;
    const userId = req.user.id;

    if (!['driver', 'passenger'].includes(newRole)) {
      return res.status(400).json({ message: 'Invalid role.' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    if (user.roles.includes(newRole)) {
      return res.status(400).json({ message: 'User already has this role.' });
    }

    if (user.roles.length >= 2) {
      return res.status(400).json({ message: 'Cannot add more roles. User already has both.' });
    }

    user.roles.push(newRole);
    await user.save();

    res.status(200).json({
      message: 'Role added successfully.',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        roles: user.roles,
        currentRole: user.currentRole
      }
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const switchRole = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    if (user.roles.length !== 2) {
      return res.status(400).json({ message: 'Cannot switch roles, only one role associated.' });
    }

    const targetRole = user.currentRole === 'driver' ? 'passenger' : 'driver';
    user.currentRole = targetRole;
    await user.save();

    res.status(200).json({
      message: 'Role switched successfully.',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        roles: user.roles,
        currentRole: user.currentRole
      }
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Route to get current user details
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password -otp -otpExpiry');
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}

module.exports = {
  register,
  verifyOTP,
  login,
  addRole,
  switchRole,
  getMe
};
