import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const connectDB = async () => {
  const username=process.env.USER_NAME;
  const password=process.env.password;

 
  const link=`mongodb+srv://${username}:${password}@cluster0.5bjic.mongodb.net/Fixdukaan?retryWrites=true&w=majority&appName=Cluster0`
  
  try {
    await mongoose.connect(link); 
    console.log('MongoDB connected...');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

export default connectDB;