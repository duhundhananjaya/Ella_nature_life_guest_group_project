import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import {addUser, getUser} from '../controllers/userController.js';

const router = express.Router();

router.post('/add', authMiddleware, addUser);
router.get('/', authMiddleware, getUser);
//router.delete('/:id', authMiddleware, deleteUser);
//router.get('/:profile', authMiddleware, getUsers);
//router.put('/:profile', authMiddleware, updateUserProfile);

export default router;