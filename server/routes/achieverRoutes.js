import express from 'express';
import {
  getAllAchievers,
  getAchieverById,
  createAchiever,
  updateAchiever,
  deleteAchiever,
  getAllFeedback,
  getFeedbackByAchiever,
  addFeedback,
  updateFeedbackStatus,
  deleteFeedback,
} from '../controllers/achieverController.js';
import { protect } from '../middleware/authMiddleware.js';
import { adminOnly } from '../middleware/adminMiddleware.js';

const router = express.Router();

// Public
router.get('/', getAllAchievers);
router.get('/feedback', getAllFeedback);
router.get('/feedback/achiever/:achieverId', getFeedbackByAchiever);
router.get('/:id', getAchieverById);
router.post('/feedback', addFeedback);

// Admin only
router.put('/feedback/:id/status', protect, adminOnly, updateFeedbackStatus);
router.delete('/feedback/:id', protect, adminOnly, deleteFeedback);
router.post('/', protect, adminOnly, createAchiever);
router.put('/:id', protect, adminOnly, updateAchiever);
router.delete('/:id', protect, adminOnly, deleteAchiever);

export default router;
