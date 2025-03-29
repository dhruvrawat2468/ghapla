import mongoose from "mongoose"

const addressSchema = new mongoose.Schema({
  houseNumber: { type: String, required: true },
  landmark: { type: String, required: true },
  street: { type: String, required: true }, // Previously 'address'
 // city: { type: String, required: false },
  pincode: { type: String, required: false }, // Optional
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: false, unique: true },
  phone: { type: String, required: true, unique: true }, // ✅ Added phoneNumber as required & unique
  password: { type: String, required: true },
  address: { type: [addressSchema], required: true }, // Accepts an array of addresses
  age: { type: Number, required: true },
  gender: { type: String, required: true, enum: ["male", "female", "other"] },
  role: { type: String, required: true, enum: ["tech", "cust", "admin"], default: "cust" }
});



// Ensure email is unique
userSchema.index({ email: 1 }, { unique: true });

export default mongoose.model("User", userSchema);
