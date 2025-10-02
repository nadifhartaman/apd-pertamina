// models/userModel.js
const { dbApd } = require("../db");

const User = {
  async findByEmail(email) {
    const [rows] = await dbApd.query("SELECT * FROM users WHERE email = ?", [email]);
    return rows[0];
  },

  async createUser({ email, full_name, hashedPassword, role = "user" }) {
    const [result] = await dbApd.query(
      `INSERT INTO users (email, full_name, role, hashed_password, is_active) 
       VALUES (?, ?, ?, ?, 1)`,
      [email, full_name, role, hashedPassword]
    );
    return result.insertId;
  },

  async saveResetToken(userId, token, expires) {
    await dbApd.query(
      "UPDATE users SET reset_token = ?, reset_expires = ? WHERE id = ?",
      [token, expires, userId]
    );
  },

  async findByResetToken(token) {
    const [rows] = await dbApd.query("SELECT * FROM users WHERE reset_token = ?", [token]);
    return rows[0];
  },

  async updatePassword(userId, hashedPassword) {
    await dbApd.query(
      "UPDATE users SET hashed_password = ?, reset_token = NULL, reset_expires = NULL WHERE id = ?",
      [hashedPassword, userId]
    );
  }
};

module.exports = User;
