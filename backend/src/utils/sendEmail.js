const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // app password
      },
    });

    await transporter.sendMail({
      from: `"LPU Pooling" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
    });

    console.log("Email sent");
  } catch (error) {
    console.log("Email error:", error.message);
    throw new Error("Email sending failed");
  }
};

module.exports = sendEmail;