import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import { updateSiteSettings, getSiteSettings} from '../controllers/siteSettingsController.js';

const router = express.Router();

router.put('/update/:id', authMiddleware,  updateSiteSettings);
router.get('/', authMiddleware, getSiteSettings);

export default router;