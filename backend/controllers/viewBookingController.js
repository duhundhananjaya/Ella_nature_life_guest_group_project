import Booking from "../models/Booking.js";
import RoomInstance from "../models/RoomInstance.js";
import { sendRoomCleaningAlert } from "./attendantTelegramSettingsController.js";

const getBookings = async (req, res) => {
    try {
        const bookings = await Booking.find().populate('client').populate('roomType').populate('roomInstances').sort({ created_at: -1 });
        return res.status(200).json({ success: true, bookings });
    } catch (error) {
        console.error('Error fetching bookings', error);
        return res.status(500).json({ success: false, message: 'Server error in getting bookings'});
    }
};

// In your update booking function
const updateBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, paymentStatus } = req.body;

    const booking = await Booking.findById(id)
      .populate('client')
      .populate('roomType')
      .populate('roomInstances');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Store old status
    const oldStatus = booking.status;

    // Update booking
    if (status) booking.status = status;
    if (paymentStatus) booking.paymentStatus = paymentStatus;
    
    await booking.save();

    // ✅ CHECK IF STATUS CHANGED TO CHECKED-OUT
    if (status === 'checked-out' && oldStatus !== 'checked-out') {
      // Extract room numbers from booking
      const roomNumbers = booking.roomInstances?.map(room => room.room_number) || [];
      
      // Send simple cleaning alert with only room numbers
      if (roomNumbers.length > 0) {
        await sendRoomCleaningAlert(roomNumbers);
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Booking updated successfully',
      booking
    });
  } catch (error) {
    console.error('Error updating booking:', error);
    return res.status(500).json({
      success: false,
      message: 'Error updating booking',
      error: error.message
    });
  }
};

const deleteBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const booking = await Booking.findById(id).populate('roomInstances');
        
        if (!booking) {
            return res.status(404).json({ success: false, message: 'Booking not found'});
        }

        if (booking.status !== 'pending' && booking.status !== 'cancelled') {
            return res.status(400).json({ 
                success: false, 
                message: `Cannot delete booking with status "${booking.status}". Only pending or cancelled bookings can be deleted.`
            });
        }

        // Free up the rooms before deleting the booking
        if (booking.roomInstances && booking.roomInstances.length > 0) {
            const roomIds = booking.roomInstances.map(room => room._id);
            await RoomInstance.updateMany(
                { _id: { $in: roomIds } },
                { 
                    $set: {
                        occupancy_status: 'available'
                    }
                }
            );
        }

        await Booking.findByIdAndDelete(id);
        
        return res.status(200).json({ success: true, message: 'Booking deleted successfully'});
    } catch (error) {
        console.error('Error deleting booking:', error);
        return res.status(500).json({success: false, message: 'Server error in deleting booking'});
    }
};

export { getBookings, updateBooking, deleteBooking };