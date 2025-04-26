import express from "express";
import OrderStatus from "../models/OrderStatus.js"; // Verify this path

const router = express.Router();

export const updateOrderStatus = async (req, res) => {
  const { orderId, cost, status, repairDetails } = req.body;

  console.log("Received request body:", { orderId, cost, status, repairDetails });

  // Validate input
  if (!orderId || !status) {
    return res.status(400).json({ message: "orderId and status are required" });
  }

  try {
    // Ensure repairDetails is an array of objects with valid cost
    const sanitizedRepairDetails = Array.isArray(repairDetails)
      ? repairDetails.map(item => ({
          whatRepaired: item.whatRepaired || "",
          cost: parseFloat(item.cost) || 0,
        }))
      : [];

    const order = await OrderStatus.findOneAndUpdate(
      { orderId },
      { 
        cost: parseFloat(cost) || 0,
        status,
        repairDetails: sanitizedRepairDetails,
        paymentStatus: status === "Cost Verification" ? "incomplete" : undefined,
        updatedAt: new Date(),
      },
      { new: true, upsert: true }
    );

    if (!order) {
      return res.status(404).json({ message: "Order status not found" });
    }

    res.status(200).json({ message: "Order status updated successfully", order });
  } catch (error) {
    console.error("Server error details:", error.message, error.stack);
    res.status(500).json({ message: "Server error", error: error.message });
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

export default router;