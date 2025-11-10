import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import {addFacility, upload, getFacility, updateFacility, deleteFacility} from '../controllers/facilityController.js';

const router = express.Router();

router.post('/add', authMiddleware, upload.single('image'), addFacility);
router.get('/', authMiddleware, getFacility);
router.put('/update/:id', authMiddleware, upload.single('image'), updateFacility);
router.delete('/delete/:id', authMiddleware, deleteFacility);

export default router;