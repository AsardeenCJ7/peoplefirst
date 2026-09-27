import express from 'express';
import {
  getAllNews,
  getNewsById,
  createNews,
  updateNews,
  deleteNews,
  toggleLikeNews,
} from '../controllers/newsController.js';
import { protect } from '../middleware/authMiddleware.js';
import { adminOnly } from '../middleware/adminMiddleware.js';

const router = express.Router();

// Public
router.get('/', getAllNews);
router.get('/:id', getNewsById);

// Authenticated users – like/unlike
router.put('/:id/like', protect, toggleLikeNews);

// Admin only – create / edit / delete
router.post('/', protect, adminOnly, createNews);
router.put('/:id', protect, adminOnly, updateNews);
router.delete('/:id', protect, adminOnly, deleteNews);

export default router;
