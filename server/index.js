/**
 * server/index.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Firebase Functions v2 entry point for PeopleFirst API.
 *
 * This file IS deployed to Firebase Cloud Functions.
 * It does NOT call app.listen() — Firebase manages the HTTP server.
 *
 * Deploy with:
 *   firebase deploy --only functions
 *
 * Environment variables must be set in Firebase before deploying:
 *   firebase functions:secrets:set MONGO_URI
 *   firebase functions:secrets:set JWT_SECRET
 *   firebase functions:secrets:set GOOGLE_CLIENT_ID
 *   firebase functions:secrets:set SMTP_PASS
 *   firebase functions:config:set ...   (for non-secret vars)
 *
 *   Or use the Firebase Console → Functions → Environment Variables.
 */

import { onRequest } from 'firebase-functions/v2/https';
import { setGlobalOptions } from 'firebase-functions/v2';
import { connectDB } from './config/db.js';
import app from './app.js';

// ─── Global function options ───────────────────────────────────────────────────
// Limit concurrent containers to keep costs predictable.
// Adjust maxInstances as your traffic grows.
setGlobalOptions({
  maxInstances: 10,
  region: 'us-central1', // Change to your preferred region if needed
});

// ─── Connect to MongoDB ────────────────────────────────────────────────────────
// We attempt the connection at module load time so that the first warm-start
// request does not have to wait for a fresh DB handshake.
// The connectDB() function caches the connection across warm invocations.
let dbReady = false;

const ensureDB = async () => {
  if (!dbReady) {
    await connectDB();
    dbReady = true;
  }
};

// Pre-connect when the function container cold-starts
ensureDB().catch((err) => {
  console.error('Initial MongoDB connection failed (will retry on request):', err.message);
  // Reset so we try again on the next request
  dbReady = false;
});

// ─── Firebase HTTP Function ────────────────────────────────────────────────────
/**
 * `api` — the single Cloud Function that proxies all /api/** requests
 * to the Express app. Firebase Hosting rewrites `/api/**` to this function.
 *
 * ⚠️  UPLOADS WARNING:
 * File uploads (multer → local filesystem) are NOT persistent in Cloud
 * Functions. The /tmp directory is ephemeral (max ~512 MB) and is wiped
 * between cold starts. Uploaded files will be LOST.
 *
 * MIGRATION REQUIRED: Replace local multer storage with Firebase Storage
 * (use `@google-cloud/storage` or the Firebase Admin SDK) before relying
 * on file uploads in production.
 */
export const api = onRequest(async (req, res) => {
  // Ensure DB is connected on every request (handles cold-start failures)
  try {
    await ensureDB();
  } catch (err) {
    console.error('MongoDB unavailable:', err.message);
    res.status(503).json({
      success: false,
      message: 'Service temporarily unavailable. Please try again shortly.',
    });
    return;
  }

  // Delegate to the Express app
  app(req, res);
});
