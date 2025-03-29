import express from "express";
import OrderStatus from "../models/OrderStatus.js"; // ✅ Correct path



const router = express.Router();

export const updateOrderStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body;

        // ✅ Validate the status value
        const validStatuses = ["Product Picked", "Cost Verification", "Repair in Progress", "Ready to Deliver"];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: "Invalid status" });
        }

        // ✅ Update order status (create if it doesn’t exist)
        const updatedOrder = await OrderStatus.findOneAndUpdate(
            { orderId },
            { status, updatedAt: new Date() },
            { new: true, upsert: true } // ✅ Creates a new record if `orderId` doesn’t exist
        );

        res.status(200).json({ message: "Status updated successfully", order: updatedOrder });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

export const getOrderById = async (req, res) => {
    try {
        const { orderId } = req.params;
        const orderStatus = await OrderStatus.findOne({ orderId });

        if (!orderStatus) {
            return res.status(404).json({ message: "Order not found" });
        }

        res.status(200).json(orderStatus);
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

