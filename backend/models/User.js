import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {type: String},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    address: {type: String},
    phone_number: {type: String},
    role: {type: String, enum:["admin", "clerk", "receptionist", "attendant"], default: "attendant"},
    baseSalary: {type: Number, default: 0}
})

const User = mongoose.model("User", userSchema);
export default User;