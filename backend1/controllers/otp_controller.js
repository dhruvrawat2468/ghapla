// controllers/otp_controller.js
import OTP from "../models/Otp_schema.js";

export const send_otp = async (req, res) => {
  try {
    const { mobile_number } = req.body;
    console.log("Send OTP Request:", { mobile_number });

    // Validate mobile number
    if (!mobile_number || !/^\d{10}$/.test(mobile_number)) {
      console.log("Invalid mobile_number:", mobile_number);
      return res.status(400).json({ error: "Invalid mobile number" });
    }

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes expiry

    // Log OTP details
    console.log("Generating OTP:", { mobile_number, otp, expiresAt });

    // Delete old OTPs for this mobile number (optional, ensures only one OTP)
    await OTP.deleteMany({ mobile_number });

    // Save OTP to database
    const otpRecord = new OTP({ mobile_number, otp, expiresAt });
    await otpRecord.save();
    console.log("OTP Saved:", {
      mobile_number: otpRecord.mobile_number,
      otp: otpRecord.otp,
      expiresAt: otpRecord.expiresAt,
    });

    // Simulate sending OTP (replace with Twilio for production)
    console.log(`OTP for ${mobile_number}: ${otp}`);

    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("Send OTP Error:", error.message, error.stack);
    res.status(500).json({ error: "Server error" });
  }
};

export const verify_otp = async (req, res) => {
  try {
    const { mobile_number, enteredOtp } = req.body;

    // Validate input
    if (!mobile_number || !enteredOtp) {
      console.log("Missing input:", { mobile_number, enteredOtp });
      return res.status(400).json({ success: false, message: "Mobile number and OTP are required" });
    }

    // Ensure mobile_number format
    if (!/^\d{10}$/.test(mobile_number)) {
      console.log("Invalid mobile_number format:", mobile_number);
      return res.status(400).json({ success: false, message: "Invalid mobile number format" });
    }

    // Find the latest OTP record
    console.log("Querying OTP for mobile:", mobile_number);
    const otpRecord = await OTP.findOne({ mobile_number }).sort({ createdAt: -1 });

    if (!otpRecord) {
      console.log("No OTP found for mobile:", mobile_number);
      return res.status(400).json({ success: false, message: "No OTP found for this mobile number" });
    }

    // Log OTP details
    console.log("OTP Record:", {
      mobile_number: otpRecord.mobile_number,
      storedOtp: otpRecord.otp,
      enteredOtp,
      expiresAt: otpRecord.expiresAt,
      isExpired: otpRecord.expiresAt <= new Date(),
    });

    // Ensure string comparison
    const storedOtp = String(otpRecord.otp).trim();
    const inputOtp = String(enteredOtp).trim();

    // Validate OTP and expiry
    const isOtpValid = storedOtp === inputOtp;
    const isNotExpired = otpRecord.expiresAt > new Date();

    console.log("OTP Validation:", {
      isOtpValid,
      isNotExpired,
      storedOtp,
      inputOtp,
    });

    if (!isOtpValid || !isNotExpired) {
      const errorMessage = !isOtpValid ? "OTP does not match" : "OTP has expired";
      console.log("Verification failed:", errorMessage);
      return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
    }

    // Delete OTP after verification
    await OTP.deleteOne({ _id: otpRecord._id });
    console.log("OTP deleted for mobile:", mobile_number);

    return res.status(200).json({ success: true, message: "OTP verified successfully" });
  } catch (error) {
    console.error("OTP Verification Error:", error.message, error.stack);
    return res.status(500).json({ success: false, message: "Server error during OTP verification" });
  }
};

// Placeholder for add_number and get_otp (not provided)
export const add_number = async (req, res) => {
  res.status(501).json({ error: "Not implemented" });
};

export const get_otp = async (req, res) => {
  res.status(501).json({ error: "Not implemented" });
};