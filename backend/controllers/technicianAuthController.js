import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Technician from "../models/technician.js";
import { validationResult } from "express-validator";

// Technician Signup Controller
export const signup = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: "Validation failed", errors: errors.array() });
    }

    const {
      name,
      mobile,
      address,
      email,
      password,
      gender,
      age,
      ifscCode,
      technicianType
    } = req.body;

    // Check if technician already exists with this email or mobile
    const existingTechnicianByEmail = email ? await Technician.findOne({ email }) : null;
    const existingTechnicianByMobile = await Technician.findOne({ mobile });

    if (existingTechnicianByEmail) {
      return res.status(400).json({ message: "Technician with this email already exists" });
    }

    if (existingTechnicianByMobile) {
      return res.status(400).json({ message: "Technician with this mobile number already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new technician
    const technician = new Technician({
      name,
      mobile,
      address,
      email,
      password: hashedPassword,
      gender,
      age,
      ifscCode,
      aadhaarImage, // Include the aadhaar image ID
      userPhoto, // Include the user photo ID
      technicianType: technicianType || 'inhouse', // Default to inhouse if not specified
      verification: 'not verified' // Default verification status
    });

    // Save technician to database
    await technician.save();

    // Generate JWT token
    const token = jwt.sign(
      { id: technician._id },
      process.env.JWT_SECRET || "fallback-secret-key",
      { expiresIn: '1h' }
    );

    // Sanitize technician object for response
    const technicianData = {
      _id: technician._id,
      name: technician.name,
      email: technician.email,
      mobile: technician.mobile,
      address: technician.address,
      gender: technician.gender,
      age: technician.age,
      aadhaarImage: technician.aadhaarImage,
      userPhoto: technician.userPhoto,
      technicianType: technician.technicianType,
      verification: technician.verification
    };

    res.status(201).json({
      message: 'Technician account created successfully',
      token,
      technician: technicianData
    });
  } catch (err) {
    console.error("Technician signup error:", err);
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
};

// Technician Login Controller
export const login = async (req, res) => {
  try {
    const { email, mobile, password } = req.body;

    // Check if either email or mobile is provided
    if (!email && !mobile) {
      return res.status(400).json({ message: "Email or mobile number is required" });
    }

    // Find technician by email or mobile
    let technician;
    if (email) {
      technician = await Technician.findOne({ email });
    } else {
      technician = await Technician.findOne({ mobile });
    }

    // Check if technician exists
    if (!technician) {
      return res.status(404).json({ message: "Technician not found" });
    }

    // Validate password
    const isPasswordValid = await bcrypt.compare(password, technician.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: technician._id },
      process.env.JWT_SECRET || "fallback-secret-key",
      { expiresIn: '1h' }
    );

    // Sanitize technician object for response
    const technicianData = {
      _id: technician._id,
      name: technician.name,
      email: technician.email,
      mobile: technician.mobile,
      address: technician.address,
      gender: technician.gender,
      age: technician.age,
      aadhaarImage: technician.aadhaarImage,
      userPhoto: technician.userPhoto,
      technicianType: technician.technicianType,
      verification: technician.verification
    };

    res.status(200).json({
      message: "Login successful",
      token,
      technician: technicianData
    });
  } catch (err) {
    console.error("Technician login error:", err);
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
};

// Get Technician Profile
export const getProfile = async (req, res) => {
  try {
    const technician = await Technician.findById(req.user.id).select('-password');

    if (!technician) {
      return res.status(404).json({ message: "Technician not found" });
    }

    res.status(200).json(technician);
  } catch (err) {
    console.error("Get technician profile error:", err);
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
};

// Technician Logout Controller
export const logout = (req, res) => {
  try {
    // Clear the token cookie if using cookies
    res.clearCookie("token");

    // Return success message
    res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    console.error("Technician logout error:", err);
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
};
