import dotenv from "dotenv";
import path from "path";

// Explicitly load .env from the config folder
dotenv.config({ path: path.resolve("config/.env") });

import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from './routes/authRoutes.js'
import imageRoutes from "./routes/image.js"; // Import the image routes
import bodyParser from "body-parser";
import deviceRoutes from "./routes/deviceRoutes.js"
import orderRoutes from "./routes/orderroutes.js"
import profileroute from "./routes/profilefetch.js"
import editprofile from "./routes/editprofile.js"
import technicianRoutes from "./routes/technicianRoute.js"; // or orderRoutes.js
import complaintRoutes from "./routes/complaintroutes.js";


const app = express();
app.use(
  cors({
    origin: "http://192.168.1.6:8081", // Allow your frontend URL
      credentials: true, // Allow cookies to be sent with requests
    })
  );
app.set("view engine","ejs")
connectDB();
app.use(bodyParser.urlencoded({ extended: true }));  // <-- Parses form data
app.use(bodyParser.json());  // <-- Parses JSON requests


const PORT = process.env.PORT || 5000;
app.use('/auth',authRoutes);
app.use("/api/devices", deviceRoutes); // path to add new devices for admin, and get all the devices as well(used for auto complete as well), and also to determine which devices can the technician repair.
app.use("/api/complaints", complaintRoutes);
app.use("/api/orders",orderRoutes); // path to create new orders
app.use("/api/other",profileroute); // path to get the profile details from backend
app.use("/api/other",editprofile); // path to edit the profile details from backend
app.use("/api/orders", technicianRoutes); // route for checking which technician has which order
app.use("/api",imageRoutes);


app.get("/", (req, res) => {
    res.render("loggedin");
});
app.get("/signup",(req,res)=>{
    res.render("signup");
})


app.listen(PORT, () => {
    console.log(`App is running on port ${PORT}`);
});

  