import nodemailer from "nodemailer";

export const sendOTPEmail = async (to, otp) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  console.log("MAIL USER:", process.env.EMAIL_USER);
  console.log("MAIL PASS:", process.env.EMAIL_PASS ? "LOADED" : "MISSING");

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject: "Password Reset OTP",
    html: `
      <h2>Password Reset</h2>
      <p>Your OTP is:</p>
      <h1>${otp}</h1>
      <p>OTP valid for 5 minutes.</p>
    `,
  });
};
