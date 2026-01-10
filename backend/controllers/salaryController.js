
import Salary from "../models/Salary.js";
import User from "../models/User.js";
import SalaryRate from "../models/SalaryRate.js";

const addSalary = async (req, res) => {
  try {
    console.log("🔵 DEBUG: Add salary request received");
    console.log("🔵 DEBUG: Request body:", req.body);
    
    const {
      staff_member,
      month,
      otHours,
      unpaidLeaveDays,
      serviceChargeShare,
      otherDeductions
    } = req.body;
    
    // Fetch user to get base salary
    const user = await User.findById(staff_member);
    if (!user) {
      return res.status(404).json({success: false, message: "User not found"});
    }
    
    const baseSalary = user.baseSalary || 0;
    
    // Fetch role-based rates
    let salaryRate = await SalaryRate.findOne({ role: user.role });
    if (!salaryRate) {
      // Create default rate if doesn't exist
      salaryRate = new SalaryRate({ role: user.role, otRate: 0, deductionRate: 0 });
      await salaryRate.save();
    }
    
    const otRate = salaryRate.otRate || 0;
    const deductionRate = salaryRate.deductionRate || 0;
    
    // Calculate OT amount
    const otAmount = (otHours || 0) * otRate;
    
    // Calculate deduction amount
    const deductionAmount = (unpaidLeaveDays || 0) * deductionRate;
    
    // Calculate net pay (service charge is added, other deductions are subtracted)
    const netPay = baseSalary + otAmount - deductionAmount + (serviceChargeShare || 0) - (otherDeductions || 0);
    
    console.log("🔵 DEBUG: Calculated values:");
    console.log("  - Base Salary:", baseSalary);
    console.log("  - OT Rate:", otRate);
    console.log("  - Deduction Rate:", deductionRate);
    console.log("  - OT Amount:", otAmount);
    console.log("  - Deduction Amount:", deductionAmount);
    console.log("  - Net Pay:", netPay);

    const newSalary = new Salary({
      user: staff_member,
      baseSalary,
      month,
      otHours: otHours || 0,
      otRate,
      otAmount,
      unpaidLeaveDays: unpaidLeaveDays || 0,
      deductionRate,
      deductionAmount,
      serviceChargeShare: serviceChargeShare || 0,
      otherDeductions: otherDeductions || 0,
      netPay,
    });
    
    console.log("🔵 DEBUG: New salary object created:", newSalary);

    await newSalary.save();
    
    console.log("🔵 DEBUG: Salary saved successfully");

    return res.status(201).json({success: true,message: "Salary added successfully", salary: newSalary});
  } catch (error) {
    console.error("❌ DEBUG: Error adding salary", error);
    console.error("❌ DEBUG: Error details:", error.message);
    return res.status(500).json({success: false,message: "Server error: " + error.message});
  }
};

const updateSalary = async (req, res) => {
  try {
    console.log("🟡 DEBUG: Update salary request received");
    console.log("🟡 DEBUG: Salary ID:", req.params.id);
    console.log("🟡 DEBUG: Request body:", req.body);
    
    const { id } = req.params;
    const {
      staff_member,
      month,
      otHours,
      unpaidLeaveDays,
      serviceChargeShare,
      otherDeductions
    } = req.body;
    
    // Fetch user to get base salary
    const user = await User.findById(staff_member);
    if (!user) {
      return res.status(404).json({success: false, message: "User not found"});
    }
    
    const baseSalary = user.baseSalary || 0;
    
    // Fetch role-based rates
    let salaryRate = await SalaryRate.findOne({ role: user.role });
    if (!salaryRate) {
      // Create default rate if doesn't exist
      salaryRate = new SalaryRate({ role: user.role, otRate: 0, deductionRate: 0 });
      await salaryRate.save();
    }
    
    const otRate = salaryRate.otRate || 0;
    const deductionRate = salaryRate.deductionRate || 0;
    
    // Calculate OT amount
    const otAmount = (otHours || 0) * otRate;
    
    // Calculate deduction amount
    const deductionAmount = (unpaidLeaveDays || 0) * deductionRate;
    
    // Calculate net pay (service charge is added, other deductions are subtracted)
    const netPay = baseSalary + otAmount - deductionAmount + (serviceChargeShare || 0) - (otherDeductions || 0);
    
    console.log("🟡 DEBUG: Calculated values:");
    console.log("  - Base Salary:", baseSalary);
    console.log("  - OT Rate:", otRate);
    console.log("  - Deduction Rate:", deductionRate);
    console.log("  - OT Amount:", otAmount);
    console.log("  - Deduction Amount:", deductionAmount);
    console.log("  - Net Pay:", netPay);

    const updated = await Salary.findByIdAndUpdate(
      id,
      {
        user: staff_member,
        baseSalary,
        month,
        otHours: otHours || 0,
        otRate,
        otAmount,
        unpaidLeaveDays: unpaidLeaveDays || 0,
        deductionRate,
        deductionAmount,
        serviceChargeShare: serviceChargeShare || 0,
        otherDeductions: otherDeductions || 0,
        netPay,
      },
      { new: true }
    );
    
    console.log("🟡 DEBUG: Updated salary:", updated);

    if (!updated) {
      console.log("⚠️ DEBUG: Salary record not found");
      return res.status(404).json({
        success: false,
        message: "Salary record not found",
      });
    }

    console.log("🟡 DEBUG: Salary updated successfully");
    return res.status(200).json({
      success: true,
      message: "Salary updated successfully",
      salary: updated
    });

  } catch (error) {
    console.error("❌ DEBUG: Error updating salary", error);
    console.error("❌ DEBUG: Error details:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error: " + error.message,
    });
  }
};

const getSalary = async (req, res) =>{
    try {
        console.log("🟢 DEBUG: Get salary request received");
        const salary = await Salary.find().populate("user", "name email role baseSalary");
        console.log("🟢 DEBUG: Salary records found:", salary.length);
        return res.status(200).json({ success: true, salary});
    } catch (error) {
        console.error('❌ DEBUG: Error fetching salary', error);
        return res.status(500).json({ success: false, message: 'Server error in getting salary'});
    }
}

const getSalaryByUserId = async (req, res) => {
  try {
    const userId = req.params.userId;

    const salaries = await Salary.find({ user: userId })
      .populate("user", "name email role baseSalary")
      .sort({ created_at: -1 });

    return res.status(200).json({ success: true, salary: salaries });

  } catch (error) {
    console.error("Error fetching salary by user ID:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

const deleteSalary = async (req, res) =>{
    try {
        const { id } = req.params;

        await Salary.findByIdAndDelete(id);
        return res.status(200).json({ success: true, message: 'Salary deleted successfully'});
    } catch (error) {
        console.error('Error deleting salary', error);
        return res.status(500).json({ success: false, message: 'Server error'});
    }
}

export {addSalary, getSalary, updateSalary, deleteSalary, getSalaryByUserId};
