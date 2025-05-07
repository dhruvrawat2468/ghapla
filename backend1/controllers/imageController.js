import crypto from "crypto";
import Image from "../models/Image.js";

// Define encryption algorithm, key, and IV (store these securely in production)
const algorithm = "aes-256-cbc";
const key = Buffer.from("12345678901234567890123456789012"); // 32 bytes for AES-256
const iv = Buffer.from("1234567890123456"); // 16 bytes IV

function encrypt(buffer) {
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  return Buffer.concat([cipher.update(buffer), cipher.final()]);
}

function decrypt(buffer) {
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  return Buffer.concat([decipher.update(buffer), decipher.final()]);
}

// Express route handler for image uploads
export const uploadImage = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file provided" });
  }
  try {
    // Encrypt the file buffer
    const encryptedData = encrypt(req.file.buffer);
    const newImage = new Image({
      filename: req.file.originalname,
      data: encryptedData,
      contentType: req.file.mimetype,
    });

    const savedImage = await newImage.save();

    // Convert to plain object and filter out the 'data' field
    const imageResponse = savedImage.toObject();
    delete imageResponse.data;

    res.json({ image: imageResponse });
  } catch (error) {
    console.error("Image upload error:", error.message);
    res.status(500).json({ error: error.message });
  }
};

// Standalone function for use in authRoutes.js
export const uploadImageStandalone = async (file) => {
  if (!file || !file.buffer) {
    throw new Error("No file provided or invalid file object");
  }
  try {
    console.log("Uploading file:", {
      originalName: file.originalname,
      size: file.size,
      mimetype: file.mimetype,
    });

    // Encrypt the file buffer
    const encryptedData = encrypt(file.buffer);
    const newImage = new Image({
      filename: file.originalname,
      data: encryptedData,
      contentType: file.mimetype,
    });

    const savedImage = await newImage.save();

    // Convert to plain object and filter out the 'data' field
    const imageResponse = savedImage.toObject();
    delete imageResponse.data;

    return { image: imageResponse };
  } catch (error) {
    console.error("Standalone image upload error:", error.message);
    throw error;
  }
};

export const getImage = async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);
    if (!image) {
      return res.status(404).json({ error: "Image not found" });
    }
    // Decrypt the image data before sending it
    const decryptedData = decrypt(image.data);
    res.set("Content-Type", image.contentType);
    res.send(decryptedData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};