import express from 'express';
import { 
  createShelter, 
  getShelters, 
  getShelter, 
  updateShelter, 
  deleteShelter,
  updateOccupancy,
  getShelterStats
} from '../controllers/shelterController';
import { protect, admin } from '../middleware/auth';

const router = express.Router();

router.route('/')
  .get(getShelters)
  .post(protect, admin, createShelter);

router.get('/stats', protect, getShelterStats);

router.route('/:id')
  .get(getShelter)
  .put(protect, admin, updateShelter)
  .delete(protect, admin, deleteShelter);

router.put('/:id/occupancy', protect, admin, updateOccupancy);

export default router;

