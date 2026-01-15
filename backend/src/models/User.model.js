const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name:{
            type: String,
            required: true,
            trim: true,
        },

        email:{
            type: String,
            required: true,
            unique: true,
            lowercase: true
        },

        phone:{
            type: String,
        },

        roles:{
            type: [String],
            enum: ["student","driver"],
            default: ["student"],
        },

        rating:{
            type: Number,
            default: 0,
        },
    },
    { timestamps: true }    //Automatically adds createdAt, updatedAt which is useful for history and analytics
);

module.exports = mongoose.model("User", userSchema);