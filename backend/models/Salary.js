import mongoose from "mongoose";

const salarySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  baseSalary: { type: Number, required: true },
  month: { type: String, required: true },
  otHours: { type: Number, default: 0 },
  otRate: { type: Number, default: 0 },
  otAmount: { type: Number, default: 0 },
  unpaidLeaveDays: { type: Number, default: 0 },
  deductionRate: { type: Number, default: 0 },
  deductionAmount: { type: Number, default: 0 },
  serviceChargeShare: { type: Number, default: 0 },
  otherDeductions: { type: Number, default: 0 },
  netPay: { type: Number, required: true },
  created_at: { type: Date, default: Date.now },
});

const Salary = mongoose.model("Salary", salarySchema);
export default Salary;
