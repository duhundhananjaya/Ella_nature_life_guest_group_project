
import Salary from "../models/Salary.js";

const addSalary = async (req, res) => {
  try {
    const { staff_member, salary } = req.body;

    const newSalary = new Salary({
      user: staff_member,
      salary,
    });

    await newSalary.save();

    return res.status(201).json({success: true,message: "Salary added successfully",});
  } catch (error) {
    console.error("Error adding salary", error);
    return res.status(500).json({success: false,message: "Server error",});
  }
};

const updateSalary = async (req, res) => {
  try {
    const { id } = req.params;
    const { staff_member, salary } = req.body;

    const updated = await Salary.findByIdAndUpdate(
      id,
      { user: staff_member, salary },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Salary record not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Salary updated successfully",
    });

  } catch (error) {
    console.error("Error updating salary", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const getSalary = async (req, res) =>{
    try {
        const salary = await Salary.find().populate("user", "name email role");
        return res.status(200).json({ success: true, salary});
    } catch (error) {
        console.error('Error fetching salary', error);
        return res.status(500).json({ success: true, message: 'Server error in getting salary'});
    }
}

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

export {addSalary, getSalary, updateSalary, deleteSalary};