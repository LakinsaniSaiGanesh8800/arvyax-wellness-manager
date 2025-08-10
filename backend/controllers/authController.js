const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS || "10");

exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Email and password required" });

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "User already exists" });

    const hash = await bcrypt.hash(password, SALT_ROUNDS);
    const user = new User({ email, password_hash: hash });
    await user.save();

    res.status(201).json({ message: "User registered" });
  } catch (err) {
    console.error("register error:", err);
    res.status(500).json({ message: err.message || "Server error" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Email and password required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    const secret = process.env.JWT_SECRET;
    if (!secret) return res.status(500).json({ message: "JWT_SECRET not configured" });

    const token = jwt.sign({ id: user._id.toString(), email: user.email }, secret, { expiresIn: process.env.JWT_EXPIRES || "1d" });

    res.json({ token });
  } catch (err) {
    console.error("login error:", err);
    res.status(500).json({ message: err.message || "Server error" });
  }
};
