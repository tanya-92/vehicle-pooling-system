const mongoose = require('mongoose');

const vehicleInfoSchema = new mongoose.Schema(
  {
    vehicleType: { type: String, trim: true },
    vehicleModel: { type: String, trim: true },
    vehicleNumber: { type: String, trim: true },
    vehicleColor: { type: String, trim: true },
    seatsAvailable: { type: Number, min: 1 },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    avatar: {
      type: String,
      default: '',
    },
    vehicleInfo: {
      type: vehicleInfoSchema,
      default: undefined,
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
    },
  },
  { timestamps: true }
);

userSchema.methods.hasCompleteVehicleInfo = function hasCompleteVehicleInfo() {
  const v = this.vehicleInfo;
  if (!v) return false;
  return Boolean(
    v.vehicleType &&
      v.vehicleModel &&
      v.vehicleNumber &&
      v.vehicleColor &&
      v.seatsAvailable
  );
};

module.exports = mongoose.model('User', userSchema);
