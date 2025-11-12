import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import {addUser, getUser, updateUser, deleteUser, getUsers, updateUserProfile, updateUserPassword} from '../controllers/userController.js';

const router = express.Router();

router.post('/add', authMiddleware, addUser);
router.get('/', authMiddleware, getUser);
router.put('/update/:id', authMiddleware, updateUser);
router.delete('/delete/:id', authMiddleware, deleteUser);
router.get('/:id', authMiddleware, getUsers);
router.put('/update/profile/:id', authMiddleware, updateUserProfile);
router.put('/update-password/profile/:id', authMiddleware, updateUserPassword);

export default router;