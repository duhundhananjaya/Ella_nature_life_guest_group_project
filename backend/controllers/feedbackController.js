import Feedback from "../models/Feedback.js";

const addFeedback =async (req, res) =>{
    try {
        const { name,email,message } =req.body;

        const existingFeedback = await Feedback.findOne({ name, email, message });

    if (existingFeedback) {
      return res.status(400).json({
        success: false,
        message: "Duplicate feedback detected. You already sent this message!",
      });
    }


        const newFeedback = new Feedback({
            name,
            email,
            message
        });

        await newFeedback.save();
        return res.status(201).json({ success: true, message: 'Feedback added successfully'});
    } catch (error) {
        console.error('Error adding Feedback', error);
        return res.status(500).json({ success: false, message: 'Server error'});
    }
}





export {addFeedback};