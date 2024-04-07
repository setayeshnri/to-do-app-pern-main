const express = require("express");
const authController = require("../controllers/auth.controller");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");
const verifyToken = require("../middleware/auth.middleware");

router.post("/signup", authController.signup);
// Login route with JWT verification middleware
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const users = await pool.query("SELECT * FROM users WHERE username = $1", [
      username,
    ]);
    if (!users.rows.length)
      return res.status(404).json({ detail: "User does not exist." });

    const success = await bcrypt.compare(password, users.rows[0].password);
    if (!success) return res.status(401).json({ detail: "Login failed" });

    // If JWT verification passed, proceed with login logic
    const token = jwt.sign(
      { username, id: users.rows[0].id },
      process.env.JWT_SECRET,
      {
        expiresIn: "1hr",
      }
    );
    res.json({ username: users.rows[0].username, token, id: users.rows[0].id });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});
module.exports = router;
