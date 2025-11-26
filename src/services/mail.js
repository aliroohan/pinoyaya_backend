const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmail = async (to, subject, html) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    html: html || ``,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

const sendOtpEmail = async (to, code, name = "") => {
  const subject = "Your verification code";
  const displayName = name ? name : "there";
  const html = `
    <div style="font-family:Arial,Helvetica,sans-serif;max-width:520px;margin:auto;padding:24px;border:1px solid #eee;border-radius:8px">
      <h2 style="margin:0 0 12px 0;color:#111">Verify your email</h2>
      <p style="margin:0 0 16px 0;color:#333">Hi ${displayName},</p>
      <p style="margin:0 0 16px 0;color:#333">Use the following One-Time Password (OTP) to complete your verification:</p>
      <div style="text-align:center;margin:24px 0">
        <span style="display:inline-block;font-size:28px;letter-spacing:6px;font-weight:700;background:#f7f7f7;padding:12px 16px;border-radius:6px;color:#111">${code}</span>
      </div>
      <p style="margin:0 0 8px 0;color:#555">This code will expire shortly. If you didn’t request this, you can ignore this email.</p>
      <p style="margin:16px 0 0 0;color:#999;font-size:12px">Pinoyaya</p>
    </div>
  `;
  await sendEmail(to, subject, html);
};

const sendPasswordSettingMail = async (to, id, name = "") => {
  const subject = "Set your password";
  const displayName = name ? name : "there";
  const link = `${process.env.ADMIN_FRONTEND_URL}/set-password/${id}`;
  const html = `
    <div style="font-family:Arial,Helvetica,sans-serif;max-width:520px;margin:auto;padding:24px;border:1px solid #eee;border-radius:8px">
      <h2 style="margin:0 0 12px 0;color:#111">Set your password</h2>
      <p style="margin:0 0 16px 0;color:#333">Hi ${displayName},</p>
      <p style="margin:0 0 16px 0;color:#333">Please click the button below to set your password for your Pinoyaya account:</p>
      <div style="text-align:center;margin:24px 0">
        <a href="${link}" style="display:inline-block;font-size:16px;font-weight:700;background:#007bff;color:#ffffff;padding:12px 24px;border-radius:6px;text-decoration:none">Set Password</a>
      </div>
      <p style="margin:0 0 8px 0;color:#555">If you didn't request this, you can ignore this email.</p>
      <p style="margin:16px 0 0 0;color:#999;font-size:12px">Pinoyaya</p>
    </div>
  `;
  return await sendEmail(to, subject, html);
};

module.exports = { sendEmail, sendOtpEmail, sendPasswordSettingMail };