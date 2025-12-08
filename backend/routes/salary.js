import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import {addSalary, deleteSalary, getSalary, getSalaryByUserId, updateSalary} from '../controllers/salaryController.js';

const router = express.Router();

router.post('/add', authMiddleware, addSalary);
router.get('/', authMiddleware, getSalary);
router.get('/user/:userId', authMiddleware, getSalaryByUserId);
router.put('/update/:id', authMiddleware, updateSalary);
router.delete('/delete/:id', authMiddleware, deleteSalary);

export default router;