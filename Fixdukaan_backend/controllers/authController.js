import bcrypt from "bcrypt";
import express from "express";
import { validationResult } from 'express-validator';
import jwt from "jsonwebtoken";
import User from "../models/user.js";

const router = express.Router();

// POST: User Signup no login required
export const signup = async (req, res) => {
  // Checking validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, phone, password, age, gender, address } = req.body;

  try {
    // Check if phoneNumber is already in use
    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return res.status(400).json({ message: "Phone number already in use" });
    }

    // Encrypting user password and saving to db
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, phone, password: hashedPassword, age, gender, address });
    await user.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// POST : User Login No Login required
export const login = async (req, res) => {
  const { phone, password } = req.body; 

  try {
    // ✅ Find user by `phone`
    const user = await User.findOne({ phone });
    if (!user) return res.status(404).json({ message: "User not found" });

    // ✅ Validate password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(401).json({ message: "Invalid credentials" });

    // ✅ Generate JWT Token
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // ✅ Send JSON response
    res.status(200).json({ message: "Login successful", token, user: { phone: user.phone, role: user.role } });
  } catch (err) {
    console.error("❌ Login Error:", err);
    res.status(500).json({ error: err.message });
  }
};




