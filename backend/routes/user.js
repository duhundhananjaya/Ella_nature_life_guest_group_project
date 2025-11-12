import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import {addUser, getUser, updateUser, deleteUser, getUsers, updateUserProfile} from '../controllers/userController.js';

const router = express.Router();

router.post('/add', authMiddleware, addUser);
router.get('/', authMiddleware, getUser);
router.put('/update/:id', authMiddleware, updateUser);
router.delete('/delete/:id', authMiddleware, deleteUser);
router.get('/:id', authMiddleware, getUsers);
router.put('/update/profile/:id', authMiddleware, updateUserProfile);

export default router;