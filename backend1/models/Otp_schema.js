// models/otp.js
import mongoose from 'mongoose';
const { Schema } = mongoose;

const otp_schema = new Schema({
  mobile_number: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Add index to auto-remove expired OTPs (optional, improves performance)
otp_schema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const Otp = mongoose.model("otp", otp_schema); // Changed to "otp" for consistency
export default Otp;