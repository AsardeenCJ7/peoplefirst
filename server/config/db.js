/**
 * server/config/db.js
 * ─────────────────────────────────────────────────────────────────────────────
 * MongoDB connection with caching for Firebase Cloud Functions.
 *
 * Cloud Functions may reuse the same Node.js process across many invocations
 * (warm starts). We cache the connection promise so that subsequent requests
 * in the same container reuse the existing mongoose connection instead of
 * opening a new one every time.
 */

import mongoose from 'mongoose';

// Module-level cache — persists across warm-start invocations in Cloud Functions
let cachedConnection = null;

export const connectDB = async () => {
  // Return immediately if we already have an open connection
  if (
    cachedConnection &&
    mongoose.connection.readyState === 1 // 1 = connected
  ) {
    return cachedConnection;
  }

  const uri =
    process.env.MONGO_URI || 'mongodb://localhost:27017/peoplefirst';

  try {
    // Keep the connection alive between Cloud Function invocations
    // bufferCommands: false ensures errors surface immediately rather than
    // buffering commands when no connection is established.
    cachedConnection = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
      bufferCommands: false,
    });

    console.log(`✅ MongoDB Connected: ${mongoose.connection.host}`);
    return cachedConnection;
  } catch (error) {
    // Do NOT log the full URI as it contains the password
    console.error(`❌ MongoDB Connection Failed: ${error.message}`);
    // Re-throw so the caller (Firebase function) can handle it gracefully
    throw error;
  }
};
