import express from "express";
import { isValidObjectId } from "mongoose";
import Order from "../models/orders.js";
import User from "../models/user.js";

const router = express.Router();

export const newOrder = async (req, res) => {
  try {
    const { 
      userId, 
      applianceName, 
      type, 
      brandName, 
      serviceDate, 
      serviceFromTime, 
      serviceToTime, 
      technicianId, 
      imageId, // Single image ID
      address 
    } = req.body;

    // Check if userId is valid
    if (!isValidObjectId(userId)) {
      return res.status(400).json({ message: "Invalid user ID.", userId });
    }

    // Validate if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Validate required order inputs
    if (!applianceName || !type || !brandName || !serviceDate || 
        !serviceFromTime || !serviceToTime || !technicianId) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Create a new order
    const newOrder = new Order({
      userId,
      applianceName,
      type,
      brandName,
      serviceDate: new Date(serviceDate),
      serviceFromTime,
      serviceToTime,
      technicianId,
      imageId: imageId || null, // Single image ID or null
      address,
      paymentStatus: 'incomplete', // Default value
      cost: null // Default value
    });

    await newOrder.save();
    
    res.status(201).json({ 
      message: "Order saved successfully!", 
      order: newOrder 
    });

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export default router;