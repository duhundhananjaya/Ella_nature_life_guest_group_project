import mongoose from "mongoose";

const salarySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  salary: { type: Number, required: true }, 
  created_at: { type: Date, default: Date.now },
});

const Salary = mongoose.model("Salary", salarySchema);
export default Salary;
