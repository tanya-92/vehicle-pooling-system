const mongoose = require("mongoose");

const rideSchema = new mongoose.Schema(
    {
        driver: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",    //create relationships between collections in MongoDB
            required: true,
        },

        from: {
            type: String,
            required: true,
        },

        to: {
            type: String,
            required: true,
        },

        rideDate: {
            type: Date,
            required: true,
        },

        totalSeats: {
            type: Number,
            required: true,
            min: 1,
        },

        availableSeats: {
            type: Number,
            required: true,
        },

        pricePerSeat: {
            type: Number,
            required: true,
        },

        rideStatus: {
            type: String,
            enum: [
                "CREATED",
                "PARTIALLY_FULL",
                "FULL",
                "EXPIRED",
                "CANCELLED",
                "ACTIVE",
                "COMPLETED",
            ],
            default: "CREATED",
        },
    },
    {timestamps: true}
);

module.exports = mongoose.model("Ride", rideSchema);