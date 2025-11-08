import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import { addRoom, upload, updateRoom, getRoom, getRoomById, deleteRoom, uploadRoomImage, setThumbnail, deleteRoomImage } from '../controllers/roomController.js';

const router = express.Router();

router.get('/:id', authMiddleware, getRoomById);
router.post('/add', authMiddleware, addRoom);
router.put('/update/:id', authMiddleware, updateRoom);
router.get('/', authMiddleware, getRoom);
router.delete('/delete/:id', authMiddleware, deleteRoom);
router.post('/upload-image/:id', authMiddleware, upload.single('room_image'), uploadRoomImage);
router.put('/set-thumbnail/:roomId/:imageId', authMiddleware, setThumbnail);
router.delete('/delete-image/:roomId/:imageId', authMiddleware, deleteRoomImage);

export default router;