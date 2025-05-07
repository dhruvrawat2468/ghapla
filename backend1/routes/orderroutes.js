import express from "express";
import { isValidObjectId } from "mongoose";
import Order from "../models/orders.js";
import User from "../models/user.js";
import Technician from "../models/technician.js";
import Device from "../models/devices.js";

const router = express.Router();

const newOrder = async (req, res) => {
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
      imageId,
      address,
    } = req.body;

    // 1. Validate required fields
    if (
      !userId ||
      !applianceName ||
      !type ||
      !brandName ||
      !serviceDate ||
      !serviceFromTime ||
      !serviceToTime ||
      !technicianId
    ) {
      return res.status(400).json({ message: "All required fields must be filled." });
    }

    // 2. Validate ObjectIds
    if (!isValidObjectId(userId) || !isValidObjectId(technicianId)) {
      return res.status(400).json({ message: "Invalid user ID or technician ID." });
    }

    // 3. Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // 4. Check if technician exists
    const technician = await Technician.findById(technicianId);
    if (!technician) {
      return res.status(404).json({ message: "Technician not found." });
    }

    // 5. Validate service time formats
    const isValidTime = (time) => /^([01]\d|2[0-3]):([0-5]\d)$/.test(time);
    if (!isValidTime(serviceFromTime) || !isValidTime(serviceToTime)) {
      return res.status(400).json({
        message: "Invalid time format. Use HH:MM (24-hour format).",
      });
    }

    // 6. Validate service type
    const allowedTypes = ["Pickup Repair Drop", "Home Repair"];
    if (!allowedTypes.includes(type)) {
      return res.status(400).json({
        message: `Invalid type. Allowed types: ${allowedTypes.join(", ")}`,
      });
    }

    // 7. Find the device by name and service mode
    const device = await Device.findOne({
      name: applianceName,
      serviceMode: type,
    });

    if (!device) {
      return res.status(404).json({
        message: "No matching device found for this service type.",
      });
    }

    // 8. Validate imageId if provided
    if (imageId && !isValidObjectId(imageId)) {
      return res.status(400).json({ message: "Invalid image ID." });
    }

    // 9. Create and save the new order
    const newOrder = new Order({
      userId,
      applianceName,
      type,
      brandName,
      serviceDate: new Date(serviceDate),
      serviceFromTime,
      serviceToTime,
      technicianId,
      imageId,
      address: address || {},
    });

    await newOrder.save();
    console.log("Order created:", newOrder._id);

    res.status(201).json({
      message: "Order saved successfully!",
      assignedTechnicianId: technicianId,
      order: newOrder,
    });
  } catch (error) {
    console.error("Create Order Error:", error.message, error.stack);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

router.get("/technician/:technicianId", async (req, res) => {
  try {
    const { technicianId } = req.params;

    // 1. Validate technicianId
    if (!isValidObjectId(technicianId)) {
      return res.status(400).json({ message: "Invalid technician ID." });
    }

    // 2. Check if technician exists
    const technician = await Technician.findById(technicianId);
    if (!technician) {
      return res.status(404).json({ message: "Technician not found." });
    }

    // 3. Find unaccepted orders
    const orders = await Order.find({
      technicianId,
      status: "unaccepted",
    }).populate("technicianId", "name mobile");

    // 4. Return orders (empty array if none)
    res.status(200).json(orders);
  } catch (error) {
    console.error("Get Orders Error:", error.message, error.stack);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.put("/accept/:orderId", async (req, res) => {
  try {
    const { orderId } = req.params;
    const { technicianId } = req.body;

    // 1. Validate orderId and technicianId
    if (!isValidObjectId(orderId) || !isValidObjectId(technicianId)) {
      return res.status(400).json({ message: "Invalid order ID or technician ID." });
    }

    // 2. Find the order
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }

    // 3. Verify the technician is assigned to this order
    if (order.technicianId.toString() !== technicianId) {
      return res.status(403).json({ message: "You are not authorized to accept this order." });
    }

    // 4. Check if the order is already accepted
    if (order.status === "accepted") {
      return res.status(400).json({ message: "Order is already accepted." });
    }

    // 5. Update order status
    order.status = "accepted";
    order.acceptedAt = new Date();
    await order.save();

    res.status(200).json({ message: "Order accepted successfully!", order });
  } catch (error) {
    console.error("Accept Order Error:", error.message, error.stack);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// New route to decline an order and reassign to another technician
router.put("/decline/:orderId", async (req, res) => {
  try {
    const { orderId } = req.params;
    const { technicianId } = req.body;
    console.log("Attempting to decline order:", { orderId, technicianId });

    // 1. Validate inputs
    if (!orderId || !technicianId) {
      console.log("Missing orderId or technicianId");
      return res.status(400).json({ message: "Order ID and technician ID are required." });
    }
    if (!isValidObjectId(orderId) || !isValidObjectId(technicianId)) {
      console.log("Invalid ObjectId format:", { orderId, technicianId });
      return res.status(400).json({ message: "Invalid order ID or technician ID format." });
    }

    // 2. Find the order
    const order = await Order.findById(orderId);
    console.log("Order query result:", order ? "Found" : "Not found");
    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }

    // 3. Verify technician authorization
    if (order.technicianId.toString() !== technicianId) {
      console.log("Technician not authorized:", { orderTechnician: order.technicianId.toString(), technicianId });
      return res.status(403).json({ message: "You are not authorized to decline this order." });
    }

    // 4. Check order status
    if (order.status !== "unaccepted") {
      console.log("Invalid order status:", order.status);
      return res.status(400).json({ message: "Only unaccepted orders can be declined." });
    }

    // 5. Find the device
    console.log("Searching for device:", { name: order.applianceName, serviceMode: order.type });
    const device = await Device.findOne({
      name: order.applianceName,
      serviceMode: order.type,
    });
    console.log("Device query result:", device ? "Found" : "Not found");
    if (!device) {
      return res.status(404).json({ message: "Device not found for this order." });
    }

    // 6. Validate technicianIds
    const availableTechnicians = Array.isArray(device.technicianIds) ? device.technicianIds : [];
    console.log("Raw technicianIds:", availableTechnicians.map(id => id.toString()));
    const validTechnicians = availableTechnicians.filter(id => isValidObjectId(id));
    console.log("Valid technicianIds:", validTechnicians.map(id => id.toString()));
    if (validTechnicians.length === 0) {
      return res.status(400).json({ message: "No valid technicians available to reassign." });
    }

    // 7. Exclude declining technician
    const otherTechnicians = validTechnicians.filter(
      (id) => id.toString() !== technicianId
    );
    console.log("Other technicians after filter:", otherTechnicians.map(id => id.toString()));
    if (otherTechnicians.length === 0) {
      return res.status(400).json({ message: "No other technicians available to reassign." });
    }

    // 8. Select new technician
    const randomIndex = Math.floor(Math.random() * otherTechnicians.length);
    const newTechnicianId = otherTechnicians[randomIndex];
    console.log("Selected newTechnicianId:", newTechnicianId.toString());

    // 9. Verify new technician
    const newTechnician = await Technician.findById(newTechnicianId);
    console.log("New technician query result:", newTechnician ? "Found" : "Not found");
    if (!newTechnician) {
      return res.status(404).json({ message: "Selected technician not found." });
    }

    // 10. Update order
    order.technicianId = newTechnicianId;
    if (!Array.isArray(order.declinedBy)) {
      order.declinedBy = [];
    }
    order.declinedBy.push(technicianId);
    console.log("Order before save:", {
      technicianId: order.technicianId.toString(),
      declinedBy: order.declinedBy.map(id => id.toString())
    });
    await order.save();
    console.log("Order saved successfully");

    res.status(200).json({
      message: "Order declined and reassigned successfully!",
      newTechnicianId: newTechnicianId.toString(),
      order,
    });
  } catch (error) {
    console.error("Decline Order Error:", error.message, error.stack);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});
// Define routes
router.post("/create", newOrder);

export default router;