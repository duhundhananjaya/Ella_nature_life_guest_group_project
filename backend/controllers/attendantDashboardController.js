import RoomInstance from "../models/RoomInstance.js";

const getAttendantDashboardData = async (req, res) => {
    try {
        const totalDirtyRooms = await RoomInstance.countDocuments({
            cleaning_status: "dirty", 
            is_active: true
        });
        
        const totalInProgressRooms = await RoomInstance.countDocuments({
            cleaning_status: "in-progress", 
            is_active: true
        });
        
        const totalCleanRooms = await RoomInstance.countDocuments({
            cleaning_status: "clean", 
            is_active: true
        });
        
        const totalInspectedRooms = await RoomInstance.countDocuments({
            cleaning_status: "inspected", 
            is_active: true
        });

        const attendantDashboardData = {
            totalDirtyRooms,
            totalInProgressRooms,
            totalCleanRooms,
            totalInspectedRooms
        };

        return res.status(200).json({ success: true, attendantDashboardData });
    } catch (error) {
        console.error("Error fetching attendant dashboard data:", error);
        return res.status(500).json({ 
            success: false, 
            message: "Error fetching dashboard data" 
        });
    }
};

export { getAttendantDashboardData };