import express from "express";
import { isValidObjectId } from "mongoose"; // To check valid userId
import Order from "../models/orders.js";
import User from "../models/user.js"; // Import User Model

const router = express.Router();

// Create an order API
export const newOrder =  async (req, res) => {
    try {
        const { userId, applianceName, type, brandName, serviceDate, serviceFromTime, serviceToTime, technicianId } = req.body;
        console.log(userId);

        // Check if userId is valid
        if (!isValidObjectId(userId)) {
            
            return res.status(400).json({ message: "Invalid user ID.",userId });
        }

        // Validate if user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        // Validate inputs
        if (!applianceName || !type || !brandName || !serviceDate || !serviceFromTime || !serviceToTime || !technicianId) {
            return res.status(400).json({ message: "All fields are required." });
        }

        // Create a new order linked to the user
        const newOrder = new Order({
            userId, // Store the user's ID
            applianceName,
            type,
            brandName,
            serviceDate: new Date(serviceDate),
            serviceFromTime,
            serviceToTime,
            technicianId
        });

        await newOrder.save();
        res.status(201).json({ message: "Order saved successfully!", order: newOrder });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export default router;
