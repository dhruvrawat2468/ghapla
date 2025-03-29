import mongoose from 'mongoose';
const {Schema} = mongoose;

const otp_schema = new Schema({
    mobile_number:{
        type:String,
        required:true
    },
    otp:{
        type:String,
        required : true
    }
});
const Otp = mongoose.model("otp_schema",otp_schema);
export default Otp;