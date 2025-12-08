import Booking from "../models/Booking.js";
import RoomInstance from "../models/RoomInstance.js";

const getClerkDashboardData = async (req, res) => {
    try {
        const totalBookings = await Booking.countDocuments();
        const totalGoodRooms = await RoomInstance.countDocuments({maintenance_status: "good", is_active: true});
        const totalNeedRepairRooms = await RoomInstance.countDocuments({maintenance_status: "needs-repair", is_active: true});
        const totalMaintenanceRooms = await RoomInstance.countDocuments({maintenance_status: "under-maintenance", is_active: true});

        const clerkDashboardData = {
            totalBookings,
            totalGoodRooms,
            totalNeedRepairRooms,
            totalMaintenanceRooms
        };

        return res.status(200).json({ success: true, clerkDashboardData });
    } catch (error) {
        console.error("Error fetching dashboard data:", error);
        return res.status(500).json({ 
            success: false, 
            message: "Error fetching dashboard data" 
        });
    }
};

export { getClerkDashboardData };