import mongoose from "mongoose";

const complaintSchema = new mongoose.Schema({
  complaintType: { type: String, enum: ["app", "technician", "service"], required: true },
  description: { type: String, required: true },
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
  technicianName: { type: String, required: true },
  appliance: { type: String, required: true },
});

export default mongoose.model("Complaint", complaintSchema);