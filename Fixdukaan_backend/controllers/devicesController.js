import express from "express";
import Device from "../models/devices.js";
const router = express.Router();

// Route to add a new device
export const addNewDevice =  async (req, res) => {
    try {
      console.log("Received body:", req.body);
  
      const { name, category, serviceMode } = req.body;
      console.log("Extracted values:", name, category, serviceMode);
  
      if (!name || !category || !serviceMode) {
        return res.status(400).json({ message: "Name, category, and service mode are required." });
      }
  
      // Validate serviceMode value
      if (!["pick-up", "repair at home"].includes(serviceMode)) {
        return res.status(400).json({ message: "Invalid service mode. Choose 'pick-up' or 'repair at home'." });
      }
  
      const newDevice = new Device({ name, category, serviceMode });
      await newDevice.save();
  
      res.status(201).json({ message: "Device added successfully", device: newDevice });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ message: "Error adding device", error: error.message });
    }
  };

// Get device using id
export const getDeviceUsingId =  async (req, res) => {
    const { id } = req.params;
    const { name, category, serviceMode } = req.body;

    try {
        // Find the device by ID and update only provided fields
        const updatedDevice = await Device.findByIdAndUpdate(
            id,
            { name, category, serviceMode },
            { new: true, runValidators: true } // Return updated document & validate input
        );

        if (!updatedDevice) {
            return res.status(404).json({ message: "Device not found" });
        }

        res.status(200).json({ message: "Device updated successfully", updatedDevice });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};


// Route to fetch all devices (for admin panel)
export const allDevices =  async (req, res) => {
  try {
    const devices = await Device.find();
    res.status(200).json(devices);
  } catch (error) {
    res.status(500).json({ message: "Error fetching devices", error: error.message });
  }
};

export default router;
