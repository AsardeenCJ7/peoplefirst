import express from 'express';
import {
  updateProfile,
  uploadAvatar,
  getAllUsers,
  toggleUserStatus,
  deleteUser,
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';
import { adminOnly } from '../middleware/adminMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

// User routes
router.put('/profile', protect, updateProfile);
router.post('/avatar', protect, upload.single('avatar'), uploadAvatar);

// Admin user management routes
router.get('/', protect, adminOnly, getAllUsers);
router.put('/:id/status', protect, adminOnly, toggleUserStatus);
router.delete('/:id', protect, adminOnly, deleteUser);

export default router;
