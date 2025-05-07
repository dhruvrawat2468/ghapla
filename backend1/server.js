import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import orderRoutes from "./routes/orderroutes.js"; // Rename for clarity
import otpRoutes from "./routes/otpRoutes.js"; // New OTP routes file
import imageRoutes from "./routes/imageRoutes.js"; // New image routes file
import bodyParser from "body-parser";
import multer from "multer"; // For image uploads

dotenv.config(); // Load environment variables

const app = express();

// CORS setup (allow multiple origins for flexibility)
// app.use(
//   cors({
//     origin: ["http://192.168.1.8:8081","http://localhost:8081"], // Add your frontend origins
//     credentials: true,
//   })
// );
app.use(
  cors({
    origin: "*", // Allow all origins for testing
    credentials: true,
  })
);

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Multer setup for file uploads (memory storage for encryption)
const upload = multer({ storage: multer.memoryStorage() });

// Database connection
connectDB();

// Routes
app.use("/auth", authRoutes); // Authentication routes (signup, login, etc.)
app.use("/api/orders", orderRoutes); // Order-related routes
app.use("/otp", otpRoutes); // OTP routes
app.use("/images", upload.fields([{ name: "aadhaarImage" }, { name: "userPhoto" }]), imageRoutes); // Image routes with multer

// Root route (optional)
app.get("/", (req, res) => {
  res.send("Welcome to the Technician API");
});

const PORT =8000;
app.listen(PORT, () => {
  console.log(`App is running on port ${PORT}`);
});