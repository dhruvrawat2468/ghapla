import OrderStatus from "../models/OrderStatus.js";
import Order from "../models/orders.js";
import Device from "../models/devices.js";
import Technician from "../models/technician.js";
import { isValidObjectId } from "mongoose";

// Get order status by ID
export const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;
    console.log(orderId);
    const orderStatus = await OrderStatus.findOne({ orderId });

    if (!orderStatus) {
      return res.status(404).json({ message: "Order not found" });
    }
    console.log("orderstatus found:",orderStatus);
    res.status(200).json(orderStatus);
  } catch (error) {
    console.error("Error fetching order status:", error.message, error.stack);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

// Set status to Arrived
export const setArrived = async (req, res) => {
  const { orderId } = req.body;

  if (!orderId || !isValidObjectId(orderId)) {
    return res.status(400).json({ message: "Valid orderId is required" });
  }

  try {
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    const orderStatus = await OrderStatus.findOneAndUpdate(
      { orderId },
      { status: "Arrived", paymentStatus: "incomplete", updatedAt: new Date() },
      { new: true, upsert: true }
    );
    res.status(200).json({ message: "Status updated to Arrived", orderStatus });
  } catch (error) {
    console.error("Error setting Arrived status:", error.message, error.stack);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Set status to Cost Verification
export const setCostVerification = async (req, res) => {
  const { orderId, cost, repairDetails } = req.body;

  if (!orderId || !isValidObjectId(orderId)) {
    return res.status(400).json({ message: "Valid orderId is required" });
  }
  if (!cost || !repairDetails || !Array.isArray(repairDetails)) {
    return res.status(400).json({ message: "Cost and repairDetails are required" });
  }

  try {
    const orderStatus = await OrderStatus.findOne({ orderId });
    if (!orderStatus) {
      return res.status(404).json({ message: "Order not found" });
    }
    if (orderStatus.status !== "Arrived") {
      return res.status(400).json({ message: "Order must be in Arrived status" });
    }
    const sanitizedRepairDetails = repairDetails.map(item => ({
      whatRepaired: item.whatRepaired || "",
      cost: parseFloat(item.cost) || 0,
    }));
    orderStatus.status = "Cost Verification";
    orderStatus.cost = parseFloat(cost) || 0;
    orderStatus.repairDetails = sanitizedRepairDetails;
    orderStatus.paymentStatus = "incomplete";
    orderStatus.updatedAt = new Date();
    await orderStatus.save();
    res.status(200).json({ message: "Status updated to Cost Verification", orderStatus });
  } catch (error) {
    console.error("Error setting Cost Verification status:", error.message, error.stack);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Accept cost
export const acceptCost = async (req, res) => {
  const { orderId } = req.body;

  if (!orderId || !isValidObjectId(orderId)) {
    return res.status(400).json({ message: "Valid orderId is required" });
  }

  try {
    const orderStatus = await OrderStatus.findOneAndUpdate(
      { orderId, status: "Cost Verification" },
      {
        status: "Repair in Progress",
        paymentStatus: "pending",
        updatedAt: new Date(),
      },
      { new: true }
    );

    if (!orderStatus) {
      return res.status(404).json({ message: "Order not found or not in Cost Verification status" });
    }

    res.status(200).json({ message: "Cost accepted successfully", orderStatus });
  } catch (error) {
    console.error("Error accepting cost:", error.message, error.stack);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Reject cost
export const rejectCost = async (req, res) => {
  const { orderId } = req.body;

  if (!orderId || !isValidObjectId(orderId)) {
    return res.status(400).json({ message: "Valid orderId is required" });
  }

  try {
    const orderStatus = await OrderStatus.findOneAndUpdate(
      { orderId, status: "Cost Verification" },
      {
        status: "Arrived",
        paymentStatus: "incomplete",
        cost: 0,
        repairDetails: [],
        updatedAt: new Date(),
      },
      { new: true }
    );

    if (!orderStatus) {
      return res.status(404).json({ message: "Order not found or not in Cost Verification status" });
    }

    res.status(200).json({ message: "Cost rejected successfully", orderStatus });
  } catch (error) {
    console.error("Error rejecting cost:", error.message, error.stack);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update order status for payment
export const updateOrderStatus = async (req, res) => {
  const { orderId, status, paymentStatus } = req.body;

  if (!orderId || !status || !paymentStatus || !isValidObjectId(orderId)) {
    return res.status(400).json({ message: "orderId, status, and paymentStatus are required" });
  }
  if (status !== "Ready to Deliver" || paymentStatus !== "completed") {
    return res.status(400).json({ message: "Invalid status or paymentStatus for payment update" });
  }

  try {
    const orderStatus = await OrderStatus.findOneAndUpdate(
      { orderId, status: "Repair in Progress" },
      { status, paymentStatus, updatedAt: new Date() },
      { new: true }
    );

    if (!orderStatus) {
      return res.status(404).json({ message: "Order not found or not in Repair in Progress status" });
    }

    res.status(200).json({ message: "Order status updated successfully", orderStatus });
  } catch (error) {
    console.error("Error updating order status:", error.message, error.stack);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Sync Order status with OrderStatus
export const syncOrderStatus = async (orderId, orderStatus) => {
  try {
    const order = await Order.findById(orderId);
    if (!order) {
      throw new Error("Order not found");
    }
    order.status = orderStatus;
    await order.save();
  } catch (error) {
    console.error("Error syncing order status:", error.message, error.stack);
  }
};

// Accept order
export const acceptOrder = async (req, res) => {
  const { orderId } = req.params;
  const { technicianId } = req.body;

  if (!isValidObjectId(orderId) || !isValidObjectId(technicianId)) {
    return res.status(400).json({ message: "Invalid order ID or technician ID" });
  }

  try {
    const orderStatus = await OrderStatus.findOne({ orderId });
    if (!orderStatus || orderStatus.status !== "unaccepted") {
      return res.status(400).json({ message: "Order not found or not unaccepted" });
    }
    const order = await Order.findById(orderId);
    if (!order || order.technicianId.toString() !== technicianId) {
      return res.status(403).json({ message: "You are not authorized to accept this order" });
    }
    orderStatus.status = "accepted";
    orderStatus.updatedAt = new Date();
    await orderStatus.save();
    await syncOrderStatus(orderId, "accepted");
    res.status(200).json({ message: "Order accepted successfully", orderStatus });
  } catch (error) {
    console.error("Error accepting order:", error.message, error.stack);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Complete order
export const completeOrder = async (req, res) => {
  const { orderId } = req.params;
  const { technicianId } = req.body;

  if (!isValidObjectId(orderId) || !isValidObjectId(technicianId)) {
    return res.status(400).json({ message: "Invalid order ID or technician ID" });
  }

  try {
    const orderStatus = await OrderStatus.findOne({ orderId });
    if (!orderStatus || orderStatus.status !== "accepted") {
      return res.status(400).json({ message: "Order not found or not accepted" });
    }
    const order = await Order.findById(orderId);
    if (!order || order.technicianId.toString() !== technicianId) {
      return res.status(403).json({ message: "You are not authorized to complete this order" });
    }
    orderStatus.status = "completed";
    orderStatus.updatedAt = new Date();
    await orderStatus.save();
    await syncOrderStatus(orderId, "completed");
    res.status(200).json({ message: "Order completed successfully", orderStatus });
  } catch (error) {
    console.error("Error completing order:", error.message, error.stack);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Decline order
export const declineOrder = async (req, res) => {
  const { orderId } = req.params;
  const { technicianId } = req.body;

  if (!isValidObjectId(orderId) || !isValidObjectId(technicianId)) {
    return res.status(400).json({ message: "Invalid order ID or technician ID" });
  }

  try {
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    if (order.technicianId.toString() !== technicianId) {
      return res.status(403).json({ message: "You are not authorized to decline this order" });
    }
    if (order.status !== "unaccepted") {
      return res.status(400).json({ message: "Only unaccepted orders can be declined" });
    }

    const orderStatus = await OrderStatus.findOne({ orderId });
    if (!orderStatus || orderStatus.status !== "unaccepted") {
      return res.status(400).json({ message: "Order not found or not unaccepted in OrderStatus" });
    }

    const device = await Device.findOne({
      name: order.applianceName,
      serviceMode: order.type,
    });
    if (!device) {
      return res.status(404).json({ message: "Device not found for this order" });
    }

    const availableTechnicians = Array.isArray(device.technicianIds) ? device.technicianIds : [];
    const validTechnicians = availableTechnicians.filter(id => isValidObjectId(id));
    if (validTechnicians.length === 0) {
      return res.status(400).json({ message: "No valid technicians available to reassign" });
    }

    const otherTechnicians = validTechnicians.filter(id => id.toString() !== technicianId);
    if (otherTechnicians.length === 0) {
      return res.status(400).json({ message: "No other technicians available to reassign" });
    }

    const randomIndex = Math.floor(Math.random() * otherTechnicians.length);
    const newTechnicianId = otherTechnicians[randomIndex];

    const newTechnician = await Technician.findById(newTechnicianId);
    if (!newTechnician) {
      return res.status(404).json({ message: "Selected technician not found" });
    }

    order.technicianId = newTechnicianId;
    if (!Array.isArray(order.declinedBy)) {
      order.declinedBy = [];
    }
    order.declinedBy.push(technicianId);
    await order.save();

    orderStatus.status = "unaccepted";
    orderStatus.updatedAt = new Date();
    await orderStatus.save();
    await syncOrderStatus(orderId, "unaccepted");

    res.status(200).json({
      message: "Order declined and reassigned successfully",
      newTechnicianId: newTechnicianId.toString(),
      orderStatus,
    });
  } catch (error) {
    console.error("Error declining order:", error.message, error.stack);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export default {
  getOrderById,
  setArrived,
  setCostVerification,
  acceptCost,
  rejectCost,
  updateOrderStatus,
  acceptOrder,
  completeOrder,
  declineOrder,
};