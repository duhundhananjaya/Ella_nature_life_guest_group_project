import Booking from "../models/Booking.js";
import RoomInstance from "../models/RoomInstance.js";

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
        const { status, paymentStatus } = req.body;
        
        console.log('=== BOOKING UPDATE START ===');
        console.log('Booking ID:', id);
        console.log('New Status:', status);
        console.log('New Payment Status:', paymentStatus);
        
        const booking = await Booking.findById(id);
        
        if (!booking) {
            console.log('❌ Booking not found');
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }
        
        console.log('📦 Booking found:', booking._id);
        console.log('📦 Current status:', booking.status);
        console.log('📦 Current payment status:', booking.paymentStatus);
        console.log('📦 Is manual booking:', booking.isManualBooking);
        console.log('📦 Room instances (before populate):', booking.roomInstances);
        
        // Now populate the room instances
        await booking.populate('roomInstances');
        
        console.log('📦 Room instances (after populate):', booking.roomInstances);
        console.log('📦 Number of room instances:', booking.roomInstances?.length || 0);
        
        const previousStatus = booking.status;
        const previousPaymentStatus = booking.paymentStatus;
        
        // Update booking status
        booking.status = status;
        
        // Update payment status only if provided and if it's a manual booking
        if (paymentStatus && booking.isManualBooking) {
            booking.paymentStatus = paymentStatus;
            console.log('💳 Payment status updated:', previousPaymentStatus, '->', paymentStatus);
        }
        
        await booking.save();
        
        console.log('✅ Booking status saved:', previousStatus, '->', status);

        // Update room instances based on status changes
        if (booking.roomInstances && booking.roomInstances.length > 0) {
            const roomIds = booking.roomInstances.map(room => room._id);
            
            console.log('🔑 Room IDs to update:', roomIds);
            console.log('🔑 Room IDs type:', typeof roomIds[0]);

            let updateData = {};

            switch(status) {
                case 'checked-out':
                    updateData = { 
                        occupancy_status: 'available',
                        cleaning_status: 'dirty'
                    };
                    break;
                    
                case 'checked-in':
                    updateData = { 
                        occupancy_status: 'occupied',
                        cleaning_status: 'clean'
                    };
                    break;
                    
                case 'confirmed':
                    updateData = { 
                        occupancy_status: 'reserved'
                    };
                    break;
                    
                case 'cancelled':
                    updateData = { 
                        occupancy_status: 'available'
                    };
                    break;
                    
                case 'pending':
                    updateData = { 
                        occupancy_status: 'available'
                    };
                    break;
            }

            console.log('📝 Update data:', updateData);

            if (Object.keys(updateData).length > 0) {
                // First, let's check if these rooms exist
                const existingRooms = await RoomInstance.find({ _id: { $in: roomIds } });
                console.log('🔍 Found rooms in database:', existingRooms.length);
                existingRooms.forEach(room => {
                    console.log(`   - Room ${room.room_number}: ${room.occupancy_status}`);
                });

                // Now update
                const result = await RoomInstance.updateMany(
                    { _id: { $in: roomIds } },
                    { $set: updateData }
                );
                
                console.log('✅ Update result:', result);
                console.log('   - Matched:', result.matchedCount);
                console.log('   - Modified:', result.modifiedCount);
                console.log('   - Acknowledged:', result.acknowledged);

                // Verify the update
                const updatedRooms = await RoomInstance.find({ _id: { $in: roomIds } });
                console.log('🔍 Rooms after update:');
                updatedRooms.forEach(room => {
                    console.log(`   - Room ${room.room_number}: ${room.occupancy_status}, ${room.cleaning_status}`);
                });
                
                if (result.modifiedCount === 0 && result.matchedCount > 0) {
                    console.log('⚠️ Rooms were matched but not modified. They might already have these values.');
                } else if (result.matchedCount === 0) {
                    console.log('⚠️ No rooms matched. Room IDs might not exist in database.');
                }
            } else {
                console.log('⚠️ No update data to apply');
            }
        } else {
            console.log('⚠️ No room instances found for this booking');
            console.log('   - roomInstances exists?', !!booking.roomInstances);
            console.log('   - roomInstances length:', booking.roomInstances?.length);
        }

        console.log('=== BOOKING UPDATE END ===\n');

        return res.status(200).json({ 
            success: true, 
            message: 'Booking updated successfully',
            booking: {
                _id: booking._id,
                status: booking.status,
                paymentStatus: booking.paymentStatus
            }
        });
    } catch (error) {
        console.error('❌ Error updating booking:', error);
        console.error('Error stack:', error.stack);
        return res.status(500).json({
            success: false,
            error: 'Server error in updating booking',
            message: error.message
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