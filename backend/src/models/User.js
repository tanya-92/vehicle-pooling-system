const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
  },
  password: {
    type: String,
    required: true,
  },
  roles: {
    type: [String],
    enum: ['driver', 'passenger'],
    validate: [
      {
        validator: function (val) {
          return val.length > 0 && val.length <= 2;
        },
        message: 'Roles array must contain 1 or 2 roles.',
      },
      {
        validator: function (val) {
          return new Set(val).size === val.length;
        },
        message: 'Roles must not contain duplicates.',
      }
    ],
    required: true,
  },
  currentRole: {
    type: String,
    enum: ['driver', 'passenger'],
    required: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  otp: {
    type: String,
  },
  otpExpiry: {
    type: Date,
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
