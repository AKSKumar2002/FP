import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
    mobile: { type: String, required: true },
    otp: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, expires: 300 } // Auto-delete after 5 minutes (300 seconds)
});

const OtpModel = mongoose.models.otp || mongoose.model('otp', otpSchema);

export default OtpModel;
