import twilio from "twilio";
import Otp from "../models/Otp_schema.js";

export const add_number = async (req,res)=>{
    try{
        const {mobile_number,otp} = req.body;
        const otp_data = await Otp.create({
            mobile_number,otp
        })
        return res.status(400).send("otp stored");
    }catch(error){
        res.status(500).send("Internal error occured");
    }
}

export const get_otp = async(req,res) =>{
    const {mobile_number} = req.body;
    try {
        let otp = await Otp.findOne({mobile_number});
        if(!otp){
            return res.status(500).json({error:"otp not found"});
        }
        return res.status(200).json({otp:otp});
    } catch (error) {
        res.status(500).send("Internal error occured");
    }
}

export const send_Otp = async(req,res)=>{
    let msg;
    try {
        const {mobile_number} = req.body;

        const mongoURI = "mongodb+srv://fixdukaan:gHpf09TADq9w1mbQ@cluster0.5bjic.mongodb.net/OTPverification?retryWrites=true&w=majority&appName=Cluster0";//mongodb string
        const accountSid = "AC7e619070708170b56f37d304b87c2024"; // Use environment variables
        const authToken = "a9e88e9c799f07f2a57cd6e304ea3adb"; // Use environment variables
        const client = new twilio(accountSid, authToken);
        // Generate a random 6-digit OTP
        const generateOTP = Math.floor(100000 + Math.random() * 900000);

        // storing otp in mongodb
        const otpDocument = new Otp({mobile_number,otp:generateOTP});
        await otpDocument.save();

         // Send OTP using Twilio
        msg = await client.messages.create({
        body: `Your OTP is ${generateOTP}`,
        from: "+17248852633",
        to: mobile_number,
        });
        
        return res.status(200).send("otp send successfully");

    } catch (error) {
        return res.status(500).json({msg:"internal error occured",error,msg});
    }
}

export const verify_otp = async(req,res) =>{
    try {
        const {mobile_number,enteredOtp} = req.body;
        // get otp from database
        const otpDocument = await Otp.findOne({mobile_number,otp:enteredOtp});
        console.log(otpDocument);
        
        if(otpDocument){
            return res.send({success:true});

        }else{
            return res.json({success:false})
        }
    } catch (error) {
        return res.status(500).json({error});
    }
}

