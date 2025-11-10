import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import {addFeature, getFeature, deleteFeature} from '../controllers/featureController.js';

const router = express.Router();

router.post('/add', authMiddleware, addFeature);
router.get('/', authMiddleware, getFeature);
router.delete('/delete/:id', authMiddleware, deleteFeature);

export default router;