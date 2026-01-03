import express from 'express';
import { 
  getAdminStats,
  getRecentActivities,
  bulkVerifyReports,
  bulkDeleteReports
} from '../controllers/adminController';
import { protect, admin } from '../middleware/auth';

const router = express.Router();

// All routes require admin authentication
router.use(protect);
router.use(admin);

router.get('/stats', getAdminStats);
router.get('/activities', getRecentActivities);
router.post('/reports/bulk-verify', bulkVerifyReports);
router.delete('/reports/bulk-delete', bulkDeleteReports);

export default router;
