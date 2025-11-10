import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import {
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
} from '../controllers/roomInstanceConroller.js';

const router = express.Router();

router.get('/', authMiddleware, getRoomInstances);          // Get all instances with filters
router.get('/:id', authMiddleware, getRoomInstanceById);   // Get instance by ID
router.get('/number/:room_number', authMiddleware, getRoomInstanceByNumber); // Get by room number

// Cleaning operations (For Attendants)
router.put('/:id/cleaning', authMiddleware, updateCleaningStatus);  // Update cleaning status
router.get('/cleaning/needed', authMiddleware, getRoomsNeedingCleaning); // Get rooms needing cleaning
router.put('/cleaning/bulk', authMiddleware, bulkUpdateCleaningStatus); // Bulk update

// Occupancy operations (For Front Desk)
router.put('/:id/occupancy', authMiddleware, updateOccupancyStatus); // Update occupancy
router.get('/available/rooms', authMiddleware, getAvailableRooms);   // Get available rooms

// Maintenance operations
router.put('/:id/maintenance', authMiddleware, updateMaintenanceStatus); // Update maintenance

// Statistics
router.get('/statistics/cleaning', authMiddleware, getCleaningStatistics); // Get statistics

export default router;