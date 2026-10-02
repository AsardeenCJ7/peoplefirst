/**
 * server/server.js
 * ─────────────────────────────────────────────────────────────────────────────
 * LOCAL DEVELOPMENT entry point only.
 * This file is NOT deployed to Firebase Functions.
 *
 * Run locally with:  npm run dev   (uses nodemon)
 *                or  npm start     (plain node)
 */

import dotenv from 'dotenv';
dotenv.config();

import { connectDB } from './config/db.js';
import app from './app.js';

const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

// ─── Connect to MongoDB, then start Express ────────────────────────────────────
const startServer = async () => {
  try {
    await connectDB();
  } catch (err) {
    console.warn(`⚠️  MongoDB connection failed: ${err.message}`);
    console.warn(`👉  Server will start anyway — ensure MONGO_URI is set correctly.\n`);
  }

  app.listen(PORT, () => {
    console.log(`\n🚀 PeopleFirst API Server`);
    console.log(`   Listening on : http://localhost:${PORT}`);
    console.log(`   Client URL   : ${CLIENT_URL}`);
    console.log(`   Environment  : ${process.env.NODE_ENV || 'development'}`);
    console.log(`   Health check : http://localhost:${PORT}/api/health\n`);
  });
};

startServer();
