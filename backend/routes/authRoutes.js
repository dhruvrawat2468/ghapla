import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import { body, validationResult } from "express-validator";

const router = express.Router();

// Middleware to validate input
const validateSignup = [
  body('email').isEmail().withMessage('Invalid email format'),
  body('name').trim().isLength({ min: 3 }).withMessage('Name must be at least 3 characters long'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('age').isInt({ min: 1 }).withMessage('Age must be a positive number'),
  body('gender').isIn(['male', 'female', 'other']).withMessage('Invalid gender'),
  body("address").isArray({ min: 1 }).withMessage("At least one address is required"),
  body("address.*.address").trim().isString().notEmpty().withMessage("Address is required"),
  body("address.*.landmark").trim().isString().notEmpty().withMessage("Landmark is required"),
  body("address.*.pincode").trim().matches(/^\d{6}$/).withMessage("Pincode must be a 6-digit number"),
  body("address.*.houseNumber").trim().isString().notEmpty().withMessage("House number is required"),
  body("address.*.city").trim().isString().notEmpty().withMessage("City is required")
];

// Signup Route
router.post('/signup', (req, res, next) => {
  console.log("Raw payload:", req.body);
  next();
}, validateSignup, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log("Validation errors:", errors.array());
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password, age, gender, address } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User with this email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword, age, gender, address });
    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Sanitize user object
    const userData = {
      _id: user._id,
      name: user.name,
      email: user.email,
      age: user.age,
      gender: user.gender,
      address: user.address,
      role: user.role
    };

    // Set cookie with JWT token
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 1000 // 1 hour
    });

    res.status(201).json({ message: 'User created and logged in successfully', token, user: userData });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(400).json({ error: err.message });
  }
});

// Login Route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(401).json({ error: 'Invalid credentials' });

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Sanitize user object
    const userData = {
      _id: user._id,
      name: user.name,
      email: user.email,
      age: user.age,
      gender: user.gender,
      address: user.address,
      role: user.role
    };

    // Set cookie with JWT token
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 1000 // 1 hour
    });

    res.status(200).json({ message: "Login successful", token, user: userData });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: err.message });
  }
});

// Logout Route
router.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logged out successfully" });
});

export default router;