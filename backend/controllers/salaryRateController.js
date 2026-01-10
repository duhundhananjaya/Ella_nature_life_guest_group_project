import SalaryRate from "../models/SalaryRate.js";

// Get all salary rates
const getSalaryRates = async (req, res) => {
  try {
    const rates = await SalaryRate.find();
    return res.status(200).json({ success: true, rates });
  } catch (error) {
    console.error("Error fetching salary rates:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get salary rate by role
const getSalaryRateByRole = async (req, res) => {
  try {
    const { role } = req.params;
    let rate = await SalaryRate.findOne({ role });
    
    // If rate doesn't exist, create default one
    if (!rate) {
      rate = new SalaryRate({ role, otRate: 0, deductionRate: 0 });
      await rate.save();
    }
    
    return res.status(200).json({ success: true, rate });
  } catch (error) {
    console.error("Error fetching salary rate by role:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// Update salary rate (admin only)
const updateSalaryRate = async (req, res) => {
  try {
    const { role } = req.params;
    const { otRate, deductionRate } = req.body;
    
    let rate = await SalaryRate.findOne({ role });
    
    if (!rate) {
      // Create new rate if doesn't exist
      rate = new SalaryRate({
        role,
        otRate: otRate || 0,
        deductionRate: deductionRate || 0,
      });
    } else {
      // Update existing rate
      rate.otRate = otRate !== undefined ? otRate : rate.otRate;
      rate.deductionRate = deductionRate !== undefined ? deductionRate : rate.deductionRate;
      rate.updated_at = Date.now();
    }
    
    await rate.save();
    
    return res.status(200).json({
      success: true,
      message: "Salary rate updated successfully",
      rate,
    });
  } catch (error) {
    console.error("Error updating salary rate:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// Initialize default rates for all roles
const initializeDefaultRates = async (req, res) => {
  try {
    const roles = ["admin", "clerk", "receptionist", "attendant"];
    
    for (const role of roles) {
      const existingRate = await SalaryRate.findOne({ role });
      if (!existingRate) {
        await SalaryRate.create({ role, otRate: 0, deductionRate: 0 });
      }
    }
    
    return res.status(200).json({
      success: true,
      message: "Default rates initialized successfully",
    });
  } catch (error) {
    console.error("Error initializing default rates:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export {
  getSalaryRates,
  getSalaryRateByRole,
  updateSalaryRate,
  initializeDefaultRates,
};
