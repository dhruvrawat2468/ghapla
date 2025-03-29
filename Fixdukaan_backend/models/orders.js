import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", // References the User model
    required: true 
  },
  applianceName: { type: String, required: true },
  type: { type: String, required: true },
  brandName: { type: String, required: true },
  serviceDate: { type: Date, required: true }, // Ensures proper date format
  serviceFromTime: { 
    type: String, 
    required: true,
    validate: {
      validator: function(value) {
        return /^([01]\d|2[0-3]):([0-5]\d)$/.test(value); // Matches HH:MM format
      },
      message: "Invalid time format. Use HH:MM (24-hour format)."
    }
  },
  serviceToTime: { 
    type: String, 
    required: true,
    validate: {
      validator: function(value) {
        return /^([01]\d|2[0-3]):([0-5]\d)$/.test(value);
      },
      message: "Invalid time format. Use HH:MM (24-hour format)."
    }
  },
  technicianId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Order", orderSchema);
