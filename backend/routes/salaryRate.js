import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import {
  getSalaryRates,
  getSalaryRateByRole,
  updateSalaryRate,
  initializeDefaultRates,
} from '../controllers/salaryRateController.js';

const router = express.Router();

router.get('/', authMiddleware, getSalaryRates);
router.get('/role/:role', authMiddleware, getSalaryRateByRole);
router.put('/update/:role', authMiddleware, updateSalaryRate);
router.post('/initialize', authMiddleware, initializeDefaultRates);

export default router;
