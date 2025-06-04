import nodemailer from "nodemailer";

export const sendOTPviaEmail = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail", // or your SMTP service
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your OTP Code",
    text: `Your OTP code for password reset is: ${otp}`,
  });
};