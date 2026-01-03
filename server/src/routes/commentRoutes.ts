import express from 'express';
import { getComments, addComment, updateComment, deleteComment } from '../controllers/commentController';
import { protect } from '../middleware/auth';

const router = express.Router();

router.get('/:reportId', getComments);
router.post('/:reportId', protect, addComment);
router.put('/:commentId', protect, updateComment);
router.delete('/:commentId', protect, deleteComment);

export default router;
