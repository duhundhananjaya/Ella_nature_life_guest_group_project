import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import {getFeedback,deleteFeedback} from '../controllers/viewFeedbackController.js';

const router = express.Router();


router.get('/', authMiddleware, getFeedback);
router.delete('/delete/:id', authMiddleware, deleteFeedback);


export default router;