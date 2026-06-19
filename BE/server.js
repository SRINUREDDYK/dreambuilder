import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { connectDB } from './config/db.js';
import { seedBadges } from './config/seedBadges.js';

import authRoutes from './routes/authRoutes.js';
import dreamRoutes from './routes/dreamRoutes.js';
import habitRoutes from './routes/habitRoutes.js';
import milestoneRoutes from './routes/milestoneRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Serving uploads if needed
const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/dreams', dreamRoutes);
app.use('/api/habits', habitRoutes);
app.use('/api/milestones', milestoneRoutes);
app.use('/api/analytics', analyticsRoutes);

// Health Check
app.get('/', (req, res) => {
  res.json({ message: '🚀 DreamBuilder API is running...' });
});

// Port configuration
const PORT = process.env.PORT || 5000;

// Start Server
const startServer = async () => {
  // Connect to DB
  await connectDB();
  
  // Seed initial badges database
  await seedBadges();

  app.listen(PORT, () => {
    console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });
};

startServer().catch(err => {
  console.error('Failed to start backend server:', err);
});
