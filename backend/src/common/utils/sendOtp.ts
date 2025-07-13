import * as nodemailer from 'nodemailer';

export async function sendOtp(email: string, otp: string): Promise<void> {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
  const mailOptions = {
    from: '"Medichoice AI" <no-reply@medichoice.ai>',
    to: email,
    subject: 'Verify Your Email – Medichoice AI',
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2 style="color: #2b7a78;">Welcome to Medichoice AI</h2>
        <p>To complete your registration, please enter the following OTP:</p>
        <p style="font-size: 24px; font-weight: bold; color: #17252a;">${otp}</p>
        <p>This OTP will expire in 10 minutes.</p>
        <p>If you didn't request this, you can ignore this message.</p>
        <br />
        <p style="font-size: 12px; color: #999;">This is an automated message. Do not reply.</p>
        <p style="font-size: 12px; color: #999;">&copy; ${new Date().getFullYear()} Medichoice AI. All rights reserved.</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`OTP sent to ${email}`);
    return Promise.resolve();
  } catch (error) {
    console.log('SMTP_HOST:', process.env.SMTP_HOST);
    console.log('SMTP_USER:', process.env.SMTP_USER);
    console.log('SMTP_PASS:', process.env.SMTP_PASS);
    console.error(`Failed to send OTP to ${email}:`, error);
    throw new Error('Failed to send OTP');
  }
}
