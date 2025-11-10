import express from 'express';
import { getRoom, getRoomById } from '../controllers/roomController.js';
import { getFacility } from '../controllers/facilityController.js';

const router = express.Router();

router.get('/', getRoom);               
router.get('/facilities', getFacility);  
router.get('/:id', getRoomById);      

export default router;
