const mongoose = require('mongoose');

const rideSchema = new mongoose.Schema({
  driver_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  pickup_location: {
    type: String,
    required: true,
  },
  drop_location: {
    type: String,
    required: true,
  },
  departure_time: {
    type: Date,
    required: true,
  },
  available_seats: {
    type: Number,
    required: true,
    min: 1,
  },
  price: {
    type: Number,
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  }
}, { timestamps: true });

module.exports = mongoose.model('Ride', rideSchema);
