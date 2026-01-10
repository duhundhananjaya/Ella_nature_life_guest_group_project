import mongoose from "mongoose";

const salaryRateSchema = new mongoose.Schema({
  role: { 
    type: String, 
    enum: ["admin", "clerk", "receptionist", "attendant"], 
    required: true,
    unique: true 
  },
  otRate: { type: Number, default: 0 },
  deductionRate: { type: Number, default: 0 },
  updated_at: { type: Date, default: Date.now },
});

const SalaryRate = mongoose.model("SalaryRate", salaryRateSchema);
export default SalaryRate;
