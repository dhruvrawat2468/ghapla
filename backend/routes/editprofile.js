import express from "express";
const router = express.Router();
import User from "../models/user.js";
import authenticate from "./authMiddleware.js";

router.put("/profile/edit", authenticate, async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: No user ID found" });
    }

    const { name, email, gender, address, age } = req.body;

    // Basic validation
    if (!email || !email.includes("@")) {
      return res.status(400).json({ message: "Invalid email" });
    }
    const parsedAge = parseInt(age);
    if (isNaN(parsedAge)) {
      return res.status(400).json({ message: "Age must be a number" });
    }

    if (!Array.isArray(address) || address.length === 0) {
      return res.status(400).json({ message: "Address array is required" });
    }

    const updateData = { name, email, gender, age: parsedAge, address };

    console.log("Updating user with data:", updateData);

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "Profile updated successfully", user: updatedUser });
  } catch (error) {
    console.error("Error updating profile:", error.message);
    console.error("Stack:", error.stack);
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: "Validation error", errors: error.errors });
    }
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;