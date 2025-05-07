import express from "express";
import { uploadImage, getImage } from "../controllers/imageController.js";

const router = express.Router();

router.post("/upload", uploadImage); // Single upload handled by multer in index.js
router.get("/:id", getImage);

export default router;