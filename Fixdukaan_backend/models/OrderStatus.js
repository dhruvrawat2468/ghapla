import mongoose from "mongoose"; // ✅ Use ES Module Import

const orderStatusSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true },
  status: {
    type: String,
    enum: ["Product Picked", "Cost Verification", "Repair in Progress", "Ready to Deliver"],
    required: true,
  },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

const OrderStatus = mongoose.model("OrderStatus", orderStatusSchema);
export default OrderStatus; // ✅ Use ES Module Export
