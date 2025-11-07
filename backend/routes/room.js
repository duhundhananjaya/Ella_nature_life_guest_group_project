import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import {addRoom, getRoom} from '../controllers/roomController.js';

const router = express.Router();

router.post('/add', authMiddleware, addRoom);
router.get('/', authMiddleware, getRoom);
//router.delete('/delete/:id', authMiddleware, deleteRoom);

export default router;