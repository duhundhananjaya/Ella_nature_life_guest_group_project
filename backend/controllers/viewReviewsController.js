import Review from '../models/Review.js';

const getReviews = async (req, res) =>{
    try {
        const reviews  = await Review.find().populate('client', 'fullName email').populate('booking').populate('roomType');
        return res.status(200).json({ success: true, reviews });
    } catch (error) {
        console.error('Error fetching reviews', error);
        return res.status(500).json({ success: true, message: 'Server error in getting reviews'});
    }
}

export { getReviews};