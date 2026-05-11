import express from 'express';
import { authenticate } from '../middleware/auth.js';
import {
  createComment,
  getComments,
  replyToComment,
  updateComment,
  deleteComment
} from '../controllers/commentController.js';

const router = express.Router();

router.use(authenticate);

router.post('/', createComment);
router.get('/project/:projectId', getComments);
router.post('/:commentId/reply', replyToComment);
router.put('/:commentId', updateComment);
router.delete('/:commentId', deleteComment);

export default router;
