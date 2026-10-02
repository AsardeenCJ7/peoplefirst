import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Route imports
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import newsRoutes from './routes/newsRoutes.js';
import achieverRoutes from './routes/achieverRoutes.js';
import awardRoutes from './routes/awardRoutes.js';
import suggestionRoutes from './routes/suggestionRoutes.js';

// ─── Environment ───────────────────────────────────────────────────────────────
// Load .env only in local development; Firebase Functions runtime uses
// environment variables set via `firebase functions:secrets` / `firebase env:set`.
dotenv.config();

// ─── __dirname for ESM ─────────────────────────────────────────────────────────
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ─── CORS origins ──────────────────────────────────────────────────────────────
// In production the frontend is served from the same Firebase Hosting domain,
// so the browser sends same-origin requests → CORS is irrelevant for those.
// We still list the Firebase Hosting domain so it works if ever cross-origin.
const ALLOWED_ORIGINS = [
  process.env.CLIENT_URL,
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  // Firebase Hosting domain – set CLIENT_URL to this in production secrets
].filter(Boolean);

// ─── Express App ───────────────────────────────────────────────────────────────
const app = express();

// ─── Middleware ────────────────────────────────────────────────────────────────
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow non-browser requests (curl, Postman, server-to-server) and
      // any origin that is in the allow-list.
      if (!origin || ALLOWED_ORIGINS.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS: origin "${origin}" not allowed`));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// ─── Static Files – Uploaded images ───────────────────────────────────────────
// ⚠️  NOTE: Local filesystem uploads are NOT persistent in Firebase Cloud
// Functions (the /tmp filesystem is ephemeral and limited to 512 MB).
// This static-file serving works only in local development.
// MIGRATION REQUIRED: Move file uploads to Firebase Storage for production.
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(
  '/uploads/suggestions',
  express.static(path.join(__dirname, 'uploads', 'suggestions'))
);

// ─── API Routes ────────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/achievers', achieverRoutes);
app.use('/api/awards', awardRoutes);
app.use('/api/suggestions', suggestionRoutes);

// ─── Health Check ──────────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'PeopleFirst API is running 🚀',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// ─── 404 Handler ───────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found.' });
});

// ─── Global Error Handler ──────────────────────────────────────────────────────
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  // Never leak secret values — only log the message/stack, not env vars
  console.error('Unhandled error:', err.stack || err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

export default app;
