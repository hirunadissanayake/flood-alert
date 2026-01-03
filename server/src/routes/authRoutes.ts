import express from 'express';
import { 
  register, 
  login, 
  getMe, 
  updateProfile, 
  markAsSafe, 
  getSafetyStatus,
  getAllUsers,
  updateUserRole,
  deleteUser,
  changePassword,
  deleteOwnAccount
} from '../controllers/authController';
import { protect, admin } from '../middleware/auth';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.put('/change-password', protect, changePassword);
router.delete('/account', protect, deleteOwnAccount);
router.put('/mark-safe', protect, markAsSafe);
router.get('/safety-status', protect, admin, getSafetyStatus);

// Admin user management routes
router.get('/users', protect, admin, getAllUsers);
router.put('/users/:id/role', protect, admin, updateUserRole);
router.delete('/users/:id', protect, admin, deleteUser);

export default router;
