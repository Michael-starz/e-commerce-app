import mongoose from "mongoose";
// const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    address: { type: String, default: "" },
    postCode: { type: String, default: "" },
    isAdmin: { type: Boolean, default: false},
    phone: { type: String, default: "" }
},
{ timestamps: true }
);

const User = mongoose.model('User', userSchema);
export default User;