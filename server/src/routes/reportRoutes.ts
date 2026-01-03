import express from 'express';
import { 
  createReport, 
  getReports, 
  getReport, 
  updateReport, 
  deleteReport,
  verifyReport,
  getReportStats
} from '../controllers/reportController';
import { protect, admin } from '../middleware/auth';
import { upload } from '../middleware/upload';

const router = express.Router();

router.route('/')
  .get(getReports)
  .post(protect, upload.single('image'), createReport);

router.get('/stats', protect, getReportStats);

router.route('/:id')
  .get(getReport)
  .put(protect, updateReport)
  .delete(protect, deleteReport);

router.put('/:id/verify', protect, admin, verifyReport);

export default router;
