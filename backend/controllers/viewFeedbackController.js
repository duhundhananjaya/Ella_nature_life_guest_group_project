import Feedback from '../models/Feedback.js';




const getFeedback = async (req, res) =>{
    try {
        const feedbacks = await Feedback.find();
        return res.status(200).json({ success: true, feedbacks});
    } catch (error) {
        console.error('Error fetching feedback', error);
        return res.status(500).json({ success: true, message: 'Server error in getting feedback'});
    }
}

const deleteFeedback = async (req, res) =>{
    try {
        const { id } = req.params;

        const existingFeedback = await Feedback.findById(id);

        await Feedback.findByIdAndDelete(id);
        return res.status(200).json({ success: true, message: 'Feedback deleted successfully'});
    } catch (error) {
        console.error('Error updating feedback', error);
        return res.status(500).json({ success: false, message: 'Server error'});
    }
}





export {getFeedback,deleteFeedback};