const nodemailer = require("nodemailer");

// 🔢 Generate OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// 📧 Send OTP Email
const sendOTP = async (email, otp) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // app password
      },
    });

    const mailOptions = {
      from: `"LPU Ride Pooling" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Verify your email - OTP",
      html: `
        <div style="font-family: Arial; padding: 20px;">
          <h2>Email Verification</h2>
          <p>Your OTP is:</p>
          <h1 style="letter-spacing: 5px;">${otp}</h1>
          <p>This OTP will expire in 5 minutes.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    console.log("✅ OTP sent to:", email);
  } catch (error) {
    console.log("❌ Email error:", error.message);
    throw new Error("Failed to send OTP");
  }
};

module.exports = {
  generateOTP,
  sendOTP,
};