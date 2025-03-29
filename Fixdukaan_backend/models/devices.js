import mongoose from "mongoose"

const deviceSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: String, required: true },
    serviceMode: { 
      type: String, 
      enum: ["pick-up", "repair at home"], 
      required: true 
    },
    addedAt: { type: Date, default: Date.now },
  });

export default mongoose.model("Device", deviceSchema);
