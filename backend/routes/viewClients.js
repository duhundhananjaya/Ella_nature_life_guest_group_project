import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import { getClients } from '../controllers/viewClientsController.js';

const router = express.Router();

router.get('/', authMiddleware, getClients);

export default router;