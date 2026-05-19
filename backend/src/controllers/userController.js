const User = require('../models/User');

const formatUser = (user) => {
  const obj = user.toObject();
  delete obj.password;
  delete obj.otp;
  delete obj.otpExpiry;
  return obj;
};

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password -otp -otpExpiry');
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.status(200).json({ user: formatUser(user) });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateVehicleInfo = async (req, res) => {
  try {
    const { phone, vehicleType, vehicleModel, vehicleNumber, vehicleColor, seatsAvailable } =
      req.body;

    if (
      !phone ||
      !vehicleType ||
      !vehicleModel ||
      !vehicleNumber ||
      !vehicleColor ||
      !seatsAvailable
    ) {
      return res.status(400).json({
        message:
          'Phone, vehicle type, model, number, color, and seats available are required.',
      });
    }

    const seats = Number(seatsAvailable);
    if (Number.isNaN(seats) || seats < 1) {
      return res.status(400).json({ message: 'Seats available must be at least 1.' });
    }

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    user.phone = phone.trim();
    user.vehicleInfo = {
      vehicleType: vehicleType.trim(),
      vehicleModel: vehicleModel.trim(),
      vehicleNumber: vehicleNumber.trim(),
      vehicleColor: vehicleColor.trim(),
      seatsAvailable: seats,
    };

    await user.save();

    res.status(200).json({
      message: 'Vehicle information updated successfully.',
      user: formatUser(user),
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getProfile,
  updateVehicleInfo,
};
