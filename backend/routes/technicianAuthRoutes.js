import express from "express";
import { body } from "express-validator";
import { signup, login, getProfile, logout } from "../controllers/technicianAuthController.js";
import authMiddleware from "./authMiddleware.js";

const router = express.Router();

// Validation middleware for technician signup
const validateTechnicianSignup = [
  body('name').trim().isLength({ min: 3 }).withMessage('Name must be at least 3 characters long'),
  body('mobile').matches(/^\d{10}$/).withMessage('Mobile number must be 10 digits'),
  body('address').trim().notEmpty().withMessage('Address is required'),
  body('email').optional().isEmail().withMessage('Invalid email format'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('gender').isIn(['Male', 'Female', 'Other']).withMessage('Invalid gender'),
  body('age').isInt({ min: 1, max: 120 }).withMessage('Age must be between 1 and 120'),
  body('ifscCode').matches(/^[A-Z]{4}0[A-Z0-9]{6}$/).withMessage('Invalid IFSC code format')
];

// Technician signup route
router.post('/signup', validateTechnicianSignup, signup);

// Technician login route
router.post('/login', login);

// Get technician profile route (protected)
router.get('/profile', authMiddleware, getProfile);

// Technician logout route
router.post('/logout', logout);

export default router;
