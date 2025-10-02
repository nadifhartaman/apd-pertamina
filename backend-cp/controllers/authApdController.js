const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const User = require("../models/userApdModel");

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

// register
async function register (req, res) {
  try {
    const { email, full_name, password, role } = req.body;

    const existing = await User.findByEmail(email);
    if (existing) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = await User.createUser({
      email,
      full_name,
      hashedPassword,
      role,
    });

    res.json({ message: "User created", userId });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function forgotPassword (req, res) {
  try {
    const { email } = req.body;
    const user = await User.findByEmail(email);
    if (!user) return res.status(400).json({ message: "Email not registered" });

    // generate kode random (6 digit) atau token
    const resetToken = crypto.randomBytes(20).toString("hex");
    const expires = new Date(Date.now() + 15 * 60 * 1000); // 15 menit

    await User.saveResetToken(user.id, resetToken, expires);

    // kirim email
    const transporter = nodemailer.createTransport({
      service: "gmail", // atau SMTP server lain
      // host: "sandbox.smtp.mailtrap.io",
      // port: 587,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const resetLink = `${process.env.FRONTEND_URL}/auth/reset-password?token=${resetToken}`;

    transporter.verify((err, success) => {
      if (err) console.error("SMTP Error:", err);
      else console.log("SMTP Ready");
    });
    
    await transporter.sendMail({
      from: `"Admin" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Reset Password Request",
      //   text: `Gunakan link berikut untuk reset password: ${resetLink}`,
      html: `
        <div style="font-size: 18px; font-family: Arial, sans-serif; background-color: #f9fafb; padding: 20px;">
          <div style="max-width: 500px; margin: auto; background: #fff; border-radius: 8px; padding: 20px; border: 1px solid #e5e7eb;">
            <h2 style="color: #111827; text-align: center;">🔐 Reset Password</h2>
            <p style="color: #374151; font-size: 15px;">
              Halo, kami menerima permintaan reset password untuk akun Anda.
            </p>
            <p style="color: #374151; font-size: 15px;">
              Klik tombol di bawah untuk mengatur ulang password Anda. Link hanya berlaku selama <strong>15 menit</strong>.
            </p>
            <div style="text-align: center; margin: 20px 0;">
              <a href="${resetLink}" 
                 style="display: inline-block; background-color: #2563eb; color: white; padding: 10px 20px; border-radius: 6px; text-decoration: none; font-weight: bold;">
                 Reset Password
              </a>
            </div>
            <hr style="margin: 20px 0; border: none; border-top: 1px solid #e5e7eb;" />
            <p style="color: #9ca3af; font-size: 12px; text-align: center;">
            Jika Anda tidak meminta reset password, abaikan email ini.
            </p>
            </div>
            </div>
            `,
    });
    
    res.json({ message: "Reset email sent" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// verifikasi token dan set password baru
async function resetPassword (req, res) {
  try {
    const { token, newPassword } = req.body;

    const user = await User.findByResetToken(token);
    if (!user) return res.status(400).json({ message: "Invalid token" });

    if (new Date(user.reset_expires) < new Date()) {
      return res.status(400).json({ message: "Token expired" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.updatePassword(user.id, hashedPassword);

    res.json({ message: "Password has been reset" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}
// login
async function login (req, res) {
  try {
    const { email, password } = req.body;

    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const match = await bcrypt.compare(password, user.hashed_password);
    if (!match) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

module.exports = { register, login, forgotPassword, resetPassword };
