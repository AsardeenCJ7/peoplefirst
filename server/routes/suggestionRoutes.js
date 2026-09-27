import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import {
  submitSuggestion,
  getAllSuggestions,
  getMySuggestions,
  reviewSuggestion,
  deleteSuggestion,
} from '../controllers/suggestionController.js';
import { protect } from '../middleware/authMiddleware.js';
import { adminOnly } from '../middleware/adminMiddleware.js';

const router = express.Router();

// ── File upload config for PDFs + images ───────────────────────────────────
const uploadDir = 'uploads/suggestions/';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname);
    cb(null, `doc-${uniqueSuffix}${ext}`);
  },
});

const fileFilter = (_req, file, cb) => {
  const allowed = /pdf|jpeg|jpg|png|webp/;
  const extOk = allowed.test(path.extname(file.originalname).toLowerCase());
  const mimeOk = /pdf|jpeg|jpg|png|webp|image/.test(file.mimetype);
  if (extOk || mimeOk) return cb(null, true);
  cb(new Error('Only PDF and image files are allowed for documents.'));
};

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB per file
  fileFilter,
});

// ── Routes ─────────────────────────────────────────────────────────────────

// Any authenticated user can submit a suggestion (with up to 5 docs)
router.post('/', protect, upload.array('documents', 5), submitSuggestion);

// Logged-in user can view their own suggestions
router.get('/mine', protect, getMySuggestions);

// Admin only: list all suggestions
router.get('/', protect, adminOnly, getAllSuggestions);

// Admin only: review (approve/reject) a suggestion
router.put('/:id/review', protect, adminOnly, reviewSuggestion);

// Admin only: delete a suggestion
router.delete('/:id', protect, adminOnly, deleteSuggestion);

export default router;
