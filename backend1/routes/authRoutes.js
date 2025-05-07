import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/technician.js";
import { body, validationResult } from "express-validator";
import { uploadImageStandalone } from "../controllers/imageController.js";
import multer from "multer";

const router = express.Router();

// Multer configuration
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

// Middleware to validate signup input
const validateSignup = [
  body("name").trim().isLength({ min: 1 }).withMessage("Name is required"),
  body("mobile").matches(/^\d{10}$/).withMessage("Mobile must be 10 digits"),
  body("address").trim().isLength({ min: 1 }).withMessage("Address is required"),
  body("email").optional().isEmail().withMessage("Invalid email format"),
  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
  body("gender").isIn(["Male", "Female", "Other"]).withMessage("Gender must be Male, Female, or Other"),
  body("age").isInt({ min: 1, max: 120 }).withMessage("Age must be between 1 and 120"),
  body("ifscCode").matches(/^[A-Z]{4}0[A-Z0-9]{6}$/).withMessage("Invalid IFSC code"),
];

// Signup Route
router.post(
  "/signup",
  upload.fields([{ name: "aadhaarImage" }, { name: "userPhoto" }]),
  validateSignup,
  async (req, res) => {
    console.log("Signup request received:");
    console.log("req.body:", req.body);
    console.log("req.files:", req.files);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log("Validation errors:", errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, mobile, address, email, password, gender, age, ifscCode } = req.body;

    try {
      // Check if mobile or email already exists
      const existingUser = await User.findOne({ $or: [{ mobile }, { email: email || null }] });
      if (existingUser) {
        console.log("User already exists:", { mobile, email });
        return res.status(400).json({ error: "Mobile number or email already registered" });
      }

      // Handle image uploads
      let aadhaarImageId = null;
      let userPhotoId = null;
      if (req.files && req.files["aadhaarImage"]) {
        console.log("Processing aadhaarImage:", req.files["aadhaarImage"][0]);
        try {
          const aadhaarResponse = await uploadImageStandalone(req.files["aadhaarImage"][0]);
          console.log("Aadhaar Response:", aadhaarResponse);
          if (!aadhaarResponse || !aadhaarResponse.image || !aadhaarResponse.image._id) {
            throw new Error("Invalid Aadhaar image response");
          }
          aadhaarImageId = aadhaarResponse.image._id;
        } catch (error) {
          console.error("Aadhaar upload error:", error.message);
          return res.status(500).json({ error: `Failed to upload Aadhaar image: ${error.message}` });
        }
      }
      if (req.files && req.files["userPhoto"]) {
        console.log("Processing userPhoto:", req.files["userPhoto"][0]);
        try {
          const photoResponse = await uploadImageStandalone(req.files["userPhoto"][0]);
          console.log("Photo Response:", photoResponse);
          if (!photoResponse || !photoResponse.image || !photoResponse.image._id) {
            throw new Error("Invalid user photo response");
          }
          userPhotoId = photoResponse.image._id;
        } catch (error) {
          console.error("Photo upload error:", error.message);
          return res.status(500).json({ error: `Failed to upload user photo: ${error.message}` });
        }
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user
      const user = new User({
        name,
        mobile,
        address,
        email: email || null,
        password: hashedPassword,
        gender,
        age,
        ifscCode,
        aadhaarImage: aadhaarImageId,
        userPhoto: userPhotoId,
      });
      await user.save();

      // Auto-login after signup
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 1000,
      });

      console.log("User created:", { id: user._id, name, mobile });
      res.status(201).json({
        message: "Technician created successfully",
        user: { id: user._id, name, mobile, email },
        token,
      });
    } catch (err) {
      console.error("Signup Error:", err.message);
      res.status(500).json({ error: err.message });
    }
  }
);

// Login and Logout routes (unchanged)
const validateLogin = [
  body("mobile").matches(/^\d{10}$/).withMessage("Mobile number must be exactly 10 digits"),
  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
];

router.post("/login", validateLogin, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { mobile, password } = req.body;

  try {
    const user = await User.findOne({ mobile });
    if (!user) return res.status(404).json({ error: "User not found" });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "Login successful",
      user: { id: user._id, name: user.name, mobile: user.mobile, email: user.email },
      token,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logged out successfully" });
});

export default router;