import express from 'express';
import {
  getAllAwards,
  getAwardById,
  createAward,
  updateAward,
  deleteAward,
  voteForAward,
  getVotingConfigData,
  updateVotingConfigData,
} from '../controllers/awardController.js';
import { protect } from '../middleware/authMiddleware.js';
import { adminOnly } from '../middleware/adminMiddleware.js';

const router = express.Router();

// Public
router.get('/', getAllAwards);
router.get('/voting-config', getVotingConfigData);
router.get('/:id', getAwardById);

// Authenticated users – vote
router.put('/:id/vote', protect, voteForAward);
router.post('/:id/vote', protect, voteForAward);

// Admin only
router.post('/', protect, adminOnly, createAward);
router.put('/voting-config/update', protect, adminOnly, updateVotingConfigData);
router.put('/:id', protect, adminOnly, updateAward);
router.delete('/:id', protect, adminOnly, deleteAward);

export default router;
