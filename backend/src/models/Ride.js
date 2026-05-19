const mongoose = require('mongoose');

const vehicleSnapshotSchema = new mongoose.Schema(
  {
    vehicleType: { type: String, required: true },
    vehicleModel: { type: String, required: true },
    vehicleColor: { type: String, required: true },
    vehicleNumber: { type: String, required: true },
  },
  { _id: false }
);

const rideSchema = new mongoose.Schema(
  {
    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    pickupLocation: {
      type: String,
      required: true,
    },
    dropLocation: {
      type: String,
      required: true,
    },
    departureTime: {
      type: Date,
      required: true,
    },
    availableSeats: {
      type: Number,
      required: true,
      min: 1,
    },
    pricePerSeat: {
      type: Number,
      required: true,
      min: 0,
    },
    vehicleSnapshot: {
      type: vehicleSnapshotSchema,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Ride', rideSchema);
