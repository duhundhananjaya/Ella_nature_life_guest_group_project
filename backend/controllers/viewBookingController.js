import Booking from "../models/Booking.js";

const getBookings = async (req, res) => {
    try {
        const bookings = await Booking.find().populate('client').populate('roomType').populate('roomInstances').sort({ created_at: -1 });
        return res.status(200).json({ success: true, bookings });
    } catch (error) {
        console.error('Error fetching bookings', error);
        return res.status(500).json({ success: false, message: 'Server error in getting bookings'});
    }
};

const updateBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;   
        const booking = await Booking.findById(id);
        if (!booking) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }
        booking.status = status;
        await booking.save();
        return res.status(200).json({ 
            success: true, 
            message: 'Booking updated successfully' 
        });
    } catch (error) {
        console.error('Error updating booking:', error);
        return res.status(500).json({
            success: false,
            error: 'Server error in updating booking'
        });
    }
};

const deleteBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const booking = await Booking.findById(id);
        
        if (!booking) {
            return res.status(404).json({ success: false, message: 'Booking not found'});
        }

        if (booking.status !== 'pending') {
            return res.status(400).json({ success: false, message: `Cannot delete booking with status "${booking.status}". Only pending bookings can be deleted.`});
        }

        await Booking.findByIdAndDelete(id);
        
        return res.status(200).json({ success: true,message: 'Booking deleted successfully'});
    } catch (error) {
        console.error('Error deleting booking:', error);
        return res.status(500).json({success: false,message: 'Server error in deleting booking'});
    }
};

export { getBookings, updateBooking, deleteBooking };