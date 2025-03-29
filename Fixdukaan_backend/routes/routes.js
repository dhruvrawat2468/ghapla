import express from "express";
import { body } from "express-validator";
import multer from "multer";
import { login, signup } from "../controllers/authController.js";
import { addNewDevice, allDevices, getDeviceUsingId } from "../controllers/devicesController.js";
import { getImage, uploadImage } from "../controllers/imageController.js";
import { newOrder } from "../controllers/orderroutes.js";
import { getOrderById, updateOrderStatus } from "../controllers/orderStatusController.js";
import OrderStatus from "../models/OrderStatus.js"; // ✅ Ensure correct import
const route = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });



// import controller
import { send_Otp, verify_otp } from "../controllers/otp_controller.js";

route.post('/api/send_otp',send_Otp);
route.post('/api/verify_otp',verify_otp);

// POST : User Login No Login required
route.post('/api/login',login)

// POST: User Signup no login required
route.post(
  '/api/signup',
  [
    body('email').isEmail().withMessage('Invalid email format'),
    body('name').isLength({ min: 3 }).withMessage('Name must be at least 3 characters long'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('age').isInt({ min: 1 }).withMessage('Age must be a positive number'),
    body('gender').isIn(['male', 'female', 'other']).withMessage('Invalid gender'),

    // Address validation
    body("address").isArray().withMessage("Address must be an array"),
    body("address.*.houseNumber").isString().notEmpty().withMessage("House number is required"),
    body("address.*.landmark").isString().notEmpty().withMessage("Landmark is required"),
    body("address.*.street").isString().notEmpty().withMessage("Street is required"),
  //  body("address.*.city").isString().notEmpty().withMessage("City is required"),
  ],
  signup
);


  
// Route to add a new device
route.post("/api/add",addNewDevice)

// Route to find and edit device using id
route.put("/api/:id",getDeviceUsingId)

// Route to get all devices
route.get("/api/all",allDevices);

// route to create order
route.post("/api/createOrder",newOrder)

// POST: update Order Status
route.post("/api/update",updateOrderStatus);

//Get: Fetch Order Status by "order id"
route.get("/api/:orderId",getOrderById);

// Route to upload image on mongodb
route.post("/api/image/upload",upload.single('file'),uploadImage);
// route to get image
route.get("/api/image/:id", getImage);
export default route;
