import RoomInstance from "../models/RoomInstance.js";
import Room from "../models/Room.js";

// Get all room instances with filters
const getRoomInstances = async (req, res) => {
  try {
    const { 
      cleaning_status, 
      occupancy_status, 
      room_type, 
    } = req.query;

    const filter = { is_active: true };
    
    if (cleaning_status) filter.cleaning_status = cleaning_status;
    if (occupancy_status) filter.occupancy_status = occupancy_status;
    if (room_type) filter.room_type = room_type;

    const instances = await RoomInstance.find(filter)
      .populate("room_type", "room_name area price adult children")
      .populate("last_cleaned_by", "name email")
      .sort({ room_number: 1 });

    return res.status(200).json({ 
      success: true, 
      instances,
      count: instances.length
    });
  } catch (error) {
    console.error('Error fetching room instances', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get single room instance by ID
const getRoomInstanceById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const instance = await RoomInstance.findById(id)
      .populate("room_type")
      .populate("last_cleaned_by", "name email");

    if (!instance) {
      return res.status(404).json({ success: false, message: 'Room instance not found' });
    }

    return res.status(200).json({ success: true, instance });
  } catch (error) {
    console.error('Error fetching room instance', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get room instance by room number
const getRoomInstanceByNumber = async (req, res) => {
  try {
    const { room_number } = req.params;
    
    const instance = await RoomInstance.findOne({ room_number })
      .populate("room_type")
      .populate("last_cleaned_by", "name email");

    if (!instance) {
      return res.status(404).json({ success: false, message: 'Room not found' });
    }

    return res.status(200).json({ success: true, instance });
  } catch (error) {
    console.error('Error fetching room instance', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Update cleaning status (For Attendants)
const updateCleaningStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { cleaning_status, notes, attendant_id } = req.body;

    const instance = await RoomInstance.findById(id);
    
    if (!instance) {
      return res.status(404).json({ success: false, message: 'Room not found' });
    }

    instance.cleaning_status = cleaning_status;
    
    if (cleaning_status === "clean" || cleaning_status === "inspected") {
      instance.last_cleaned_at = new Date();
      if (attendant_id) {
        instance.last_cleaned_by = attendant_id;
      }
    }
    
    if (notes) {
      instance.notes = notes;
    }

    await instance.save();

    const updatedInstance = await RoomInstance.findById(id)
      .populate("room_type", "room_name")
      .populate("last_cleaned_by", "name email");

    return res.status(200).json({ 
      success: true, 
      message: 'Cleaning status updated successfully',
      instance: updatedInstance
    });
  } catch (error) {
    console.error('Error updating cleaning status', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Update occupancy status (For Front Desk)
const updateOccupancyStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { occupancy_status } = req.body;

    const instance = await RoomInstance.findById(id);
    
    if (!instance) {
      return res.status(404).json({ success: false, message: 'Room not found' });
    }

    instance.occupancy_status = occupancy_status;
    
    // When guest checks out, mark room as dirty
    if (occupancy_status === "available" && instance.cleaning_status === "clean") {
      instance.cleaning_status = "dirty";
    }

    await instance.save();

    return res.status(200).json({ 
      success: true, 
      message: 'Occupancy status updated successfully',
      instance
    });
  } catch (error) {
    console.error('Error updating occupancy status', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Update maintenance status
const updateMaintenanceStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { maintenance_status, notes } = req.body;

    const instance = await RoomInstance.findById(id);
    
    if (!instance) {
      return res.status(404).json({ success: false, message: 'Room not found' });
    }

    instance.maintenance_status = maintenance_status;
    
    if (maintenance_status === "under-maintenance") {
      instance.occupancy_status = "blocked";
    }

    if (maintenance_status === "good") {
      instance.occupancy_status = "available";
    }

    if (maintenance_status === "needs-repair") {
      instance.occupancy_status = "available";
    }
    
    if (notes) {
      instance.notes = notes;
    }

    await instance.save();

    return res.status(200).json({ 
      success: true, 
      message: 'Maintenance status updated successfully',
      instance
    });
  } catch (error) {
    console.error('Error updating maintenance status', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get rooms that need cleaning (For Attendant Dashboard)
const getRoomsNeedingCleaning = async (req, res) => {
  try {
    const dirtyRooms = await RoomInstance.find({ 
      cleaning_status: { $in: ["dirty", "in-progress"] },
      is_active: true
    })
    .populate("room_type", "room_name")
    .sort({ room_number: 1 });

    return res.status(200).json({ 
      success: true, 
      rooms: dirtyRooms,
      count: dirtyRooms.length
    });
  } catch (error) {
    console.error('Error fetching dirty rooms', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get available clean rooms (For Booking)
const getAvailableRooms = async (req, res) => {
  try {
    const { room_type } = req.query;
    
    const filter = {
      cleaning_status: "clean",
      occupancy_status: "available",
      maintenance_status: "good",
      is_active: true
    };

    if (room_type) {
      filter.room_type = room_type;
    }

    const availableRooms = await RoomInstance.find(filter)
      .populate("room_type", "room_name area price adult children")
      .sort({ room_number: 1 });

    // Group by room type
    const groupedByType = availableRooms.reduce((acc, room) => {
      const typeName = room.room_type.room_name;
      if (!acc[typeName]) {
        acc[typeName] = {
          room_type: room.room_type,
          available_rooms: []
        };
      }
      acc[typeName].available_rooms.push(room);
      return acc;
    }, {});

    return res.status(200).json({ 
      success: true, 
      rooms: Object.values(groupedByType),
      total_available: availableRooms.length
    });
  } catch (error) {
    console.error('Error fetching available rooms', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Bulk update cleaning status (Mark multiple rooms as clean)
const bulkUpdateCleaningStatus = async (req, res) => {
  try {
    const { room_ids, cleaning_status, attendant_id } = req.body;

    if (!Array.isArray(room_ids) || room_ids.length === 0) {
      return res.status(400).json({ success: false, message: 'Room IDs array is required' });
    }

    const updateData = { 
      cleaning_status,
      updated_at: new Date()
    };

    if (cleaning_status === "clean" || cleaning_status === "inspected") {
      updateData.last_cleaned_at = new Date();
      if (attendant_id) {
        updateData.last_cleaned_by = attendant_id;
      }
    }

    const result = await RoomInstance.updateMany(
      { _id: { $in: room_ids } },
      { $set: updateData }
    );

    return res.status(200).json({ 
      success: true, 
      message: `${result.modifiedCount} rooms updated successfully`,
      modified_count: result.modifiedCount
    });
  } catch (error) {
    console.error('Error bulk updating cleaning status', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get cleaning statistics
const getCleaningStatistics = async (req, res) => {
  try {
    const stats = await RoomInstance.aggregate([
      { $match: { is_active: true } },
      {
        $group: {
          _id: "$cleaning_status",
          count: { $sum: 1 }
        }
      }
    ]);

    const occupancyStats = await RoomInstance.aggregate([
      { $match: { is_active: true } },
      {
        $group: {
          _id: "$occupancy_status",
          count: { $sum: 1 }
        }
      }
    ]);

    const maintenanceStats = await RoomInstance.aggregate([
      { $match: { is_active: true } },
      {
        $group: {
          _id: "$maintenance_status",
          count: { $sum: 1 }
        }
      }
    ]);

    return res.status(200).json({ 
      success: true, 
      statistics: {
        cleaning: stats,
        occupancy: occupancyStats,
        maintenance: maintenanceStats
      }
    });
  } catch (error) {
    console.error('Error fetching statistics', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

export { 
  getRoomInstances,
  getRoomInstanceById,
  getRoomInstanceByNumber,
  updateCleaningStatus,
  updateOccupancyStatus,
  updateMaintenanceStatus,
  getRoomsNeedingCleaning,
  getAvailableRooms,
  bulkUpdateCleaningStatus,
  getCleaningStatistics
};