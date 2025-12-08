import Booking from "../models/Booking.js";
import RoomInstance from "../models/RoomInstance.js";

const getReports = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        if (!startDate || !endDate) {
            return res.status(400).json({
                success: false,
                message: "Start date and end date are required"
            });
        }

        // Convert dates to proper format
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);

        // Total bookings in date range
        const totalBookings = await Booking.countDocuments({
            created_at: { $gte: start, $lte: end }
        });

        // Bookings by status
        const confirmedBookings = await Booking.countDocuments({
            created_at: { $gte: start, $lte: end },
            status: "confirmed"
        });

        const cancelledBookings = await Booking.countDocuments({
            created_at: { $gte: start, $lte: end },
            status: "cancelled"
        });

        const pendingBookings = await Booking.countDocuments({
            created_at: { $gte: start, $lte: end },
            status: "pending"
        });

        // Revenue calculations
        const revenueResult = await Booking.aggregate([
            {
                $match: {
                    created_at: { $gte: start, $lte: end },
                    paymentStatus: "paid"
                }
            },
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: "$totalPrice" }
                }
            }
        ]);

        const totalRevenue = revenueResult[0]?.totalRevenue || 0;

        const pendingRevenueResult = await Booking.aggregate([
            {
                $match: {
                    created_at: { $gte: start, $lte: end },
                    paymentStatus: "pending"
                }
            },
            {
                $group: {
                    _id: null,
                    pendingRevenue: { $sum: "$totalPrice" }
                }
            }
        ]);

        const pendingRevenue = pendingRevenueResult[0]?.pendingRevenue || 0;

        // Room statistics (current state, not date-based)
        const availableRooms = await RoomInstance.countDocuments({
            occupancy_status: "available",
            is_active: true
        });

        const occupiedRooms = await RoomInstance.countDocuments({
            occupancy_status: "occupied",
            is_active: true
        });

        const dirtyRooms = await RoomInstance.countDocuments({
            cleaning_status: "dirty",
            is_active: true
        });

        const totalActiveRooms = await RoomInstance.countDocuments({
            is_active: true
        });

        const occupancyRate = totalActiveRooms > 0 
            ? (occupiedRooms / totalActiveRooms) * 100 
            : 0;

        // Recent bookings with guest details
        const recentBookings = await Booking.find({
            created_at: { $gte: start, $lte: end }
        })
        .populate('client', 'fullName')
        .populate('roomInstances', 'room_number')
        .sort({ created_at: -1 })
        .limit(50)
        .lean();

        // Format bookings for response
        const formattedBookings = recentBookings.map(booking => ({
            created_at: booking.created_at,
            fullName: booking.client?.fullName || 'N/A', 
            room_number: booking.roomInstances?.[0]?.room_number || 'N/A',
            checkIn: booking.checkIn,
            checkOut: booking.checkOut,
            status: booking.status,
            paymentStatus: booking.paymentStatus,
            totalPrice: booking.totalPrice
        }));

        // Payment method breakdown (if available in your schema)
        const paymentMethodBreakdown = await Booking.aggregate([
            {
                $match: {
                    created_at: { $gte: start, $lte: end },
                    paymentStatus: "paid"
                }
            },
            {
                $group: {
                    _id: "$paymentMethod",
                    count: { $sum: 1 },
                    totalAmount: { $sum: "$totalPrice" }
                }
            }
        ]);

        const reportData = {
            dateRange: {
                startDate,
                endDate
            },
            totalBookings,
            confirmedBookings,
            cancelledBookings,
            pendingBookings,
            totalRevenue,
            pendingRevenue,
            availableRooms,
            occupiedRooms,
            dirtyRooms,
            totalActiveRooms,
            occupancyRate,
            recentBookings: formattedBookings,
            paymentMethodBreakdown
        };

        return res.status(200).json({
            success: true,
            reportData
        });

    } catch (error) {
        console.error("Error generating report:", error);
        return res.status(500).json({
            success: false,
            message: "Error generating report",
            error: error.message
        });
    }
};

export { getReports };