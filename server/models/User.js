import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {type: String, required: true },
    email: {type: String, required: true, unique: true},
    mobile: {type: String, required: true, unique: true},
    password: {type: String }, // Not required for OTP step
    cartItems: {type: Object, default: {} },
}, {minimize: false})

const User = mongoose.models.user || mongoose.model('user', userSchema)

export default User