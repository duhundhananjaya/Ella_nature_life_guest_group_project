import express from 'express';

import { addFeedback } from '../controllers/feedbackController.js';

const router = express.Router();

            
router.post('/add', addFeedback);   

export default router;
