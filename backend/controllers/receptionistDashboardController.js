import Booking from "../models/Booking.js";
import RoomInstance from "../models/RoomInstance.js";

const getReceptionistDashboardData = async (req, res) => {
    try {
        const totalBookings = await Booking.countDocuments();
        const totalCancelledBookings = await Booking.countDocuments({ status: "cancelled" });
        const totalAvailableRooms = await RoomInstance.countDocuments({occupancy_status: "available", is_active: true});
        const totalOccupiedRooms = await RoomInstance.countDocuments({occupancy_status: "occupied", is_active: true});

        const revenueResult = await Booking.aggregate([
            {
                $match: { paymentStatus: "paid" }
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
                $match: { paymentStatus: "pending" }
            },
            {
                $group: {
                    _id: null,
                    totalPendingRevenue: { $sum: "$totalPrice" }
                }
            }
        ]);

        const totalPendingRevenue = pendingRevenueResult[0]?.totalPendingRevenue || 0;

        const receptionistDashboardData = {
            totalBookings,
            totalCancelledBookings,
            totalAvailableRooms,
            totalOccupiedRooms,
            totalRevenue,
            totalPendingRevenue,
        };

        return res.status(200).json({ success: true, receptionistDashboardData });
    } catch (error) {
        console.error("Error fetching dashboard data:", error);
        return res.status(500).json({ 
            success: false, 
            message: "Error fetching dashboard data" 
        });
    }
};

export { getReceptionistDashboardData };