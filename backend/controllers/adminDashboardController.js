import Booking from "../models/Booking.js";
import RoomInstance from "../models/RoomInstance.js";

const getAdminDashboardData = async (req, res) => {
    try {
        const totalBookings = await Booking.countDocuments();
        const totalAvailableRooms = await RoomInstance.countDocuments({occupancy_status: "available", is_active: true});
        const totalOccupiedRooms = await RoomInstance.countDocuments({occupancy_status: "occupied", is_active: true});

        const revenueResult = await Booking.aggregate([
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: "$totalPrice" }
                }
            }
        ]);
        const totalRevenue = revenueResult[0]?.totalRevenue || 0;

        const adminDashboardData = {
            totalBookings,
            totalAvailableRooms,
            totalOccupiedRooms,
            totalRevenue
        };

        return res.status(200).json({ success: true, adminDashboardData });
    } catch (error) {
        console.error("Error fetching dashboard data:", error);
        return res.status(500).json({ 
            success: false, 
            message: "Error fetching dashboard data" 
        });
    }
};

export { getAdminDashboardData };