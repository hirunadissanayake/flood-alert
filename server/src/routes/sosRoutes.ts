import express from 'express';
import { 
  createSOSRequest, 
  getSOSRequests, 
  getSOSRequest, 
  updateSOSRequest, 
  deleteSOSRequest,
  acceptSOSRequest,
  completeSOSRequest,
  getSOSStats
} from '../controllers/sosController';
import { protect, admin } from '../middleware/auth';

const router = express.Router();

router.route('/')
  .get(protect, getSOSRequests)
  .post(protect, createSOSRequest);

router.get('/stats', protect, admin, getSOSStats);

router.route('/:id')
  .get(protect, getSOSRequest)
  .put(protect, updateSOSRequest)
  .delete(protect, deleteSOSRequest);

router.put('/:id/accept', protect, admin, acceptSOSRequest);
router.put('/:id/complete', protect, admin, completeSOSRequest);

export default router;
