import Booking from "../models/Booking.js";
import RoomInstance from "../models/RoomInstance.js";
import User from "../models/User.js";

const getAdminDashboardData = async (req, res) => {
    try {
        const totalBookings = await Booking.countDocuments();
        const totalCancelledBookings = await Booking.countDocuments({ status: "cancelled" });
        const totalAvailableRooms = await RoomInstance.countDocuments({occupancy_status: "available", is_active: true});
        const totalDirtyRooms = await RoomInstance.countDocuments({cleaning_status: "dirty", is_active: true});
        const totalOccupiedRooms = await RoomInstance.countDocuments({occupancy_status: "occupied", is_active: true});
        const totalStaff = await User.countDocuments();

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

        const monthlyRevenue = await Booking.aggregate([
            {
                $match: { paymentStatus: "paid" }
            },
            {
                $group: {
                    _id: {
                        year: { $year: "$created_at" },
                        month: { $month: "$created_at" }
                    },
                    totalRevenue: { $sum: "$totalPrice" }
                }
            },
            {
                $sort: {
                    "_id.year": 1,
                    "_id.month": 1
                }
            }
        ]);

        let monthlyRevenueArray = new Array(12).fill(0);
        monthlyRevenue.forEach(item => {
            const index = item._id.month - 1;
            monthlyRevenueArray[index] = item.totalRevenue;
        });

        const adminDashboardData = {
            totalBookings,
            totalCancelledBookings,
            totalAvailableRooms,
            totalOccupiedRooms,
            totalDirtyRooms,
            totalStaff,
            totalRevenue,
            totalPendingRevenue,
            monthlyRevenue: monthlyRevenueArray
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