import mongoose from "mongoose";

const orderStatusSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true },
  status: {
    type: String,
    enum: [
      "unaccepted",
      "accepted",
      "completed",
      "Arrived",
      "Cost Verification",
      "Repair in Progress",
      "Ready to Deliver"
    ],
    default: "unaccepted",
    required: true,
  },
  repairDetails: [
    {
      whatRepaired: { type: String },
      cost: { type: Number },
    },
  ],
  cost: { type: Number, default: 0 },
  paymentStatus: { type: String, enum: ["incomplete", "pending", "completed"], default: "incomplete" },
  updatedAt: { type: Date, default: Date.now },
}, { timestamps: true });

const OrderStatus = mongoose.model("OrderStatus", orderStatusSchema);
export default OrderStatus;