import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import authRouter from './routes/auth.js';
import configRouter from './routes/config.js';
import contentRouter from './routes/content.js';
import mediaRouter from './routes/media.js';

const app = express();
const PORT = parseInt(process.env.PORT || '3001', 10);

// Security
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, '..', '..', 'uploads')));

// Routes
app.use('/api/auth', authRouter);
app.use('/api/config', configRouter);
app.use('/api/content', contentRouter);
app.use('/api/media', mediaRouter);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`\n🚀 Cabinet OEFIC API démarrée`);
  console.log(`   URL : http://localhost:${PORT}`);
  console.log(`   Santé : http://localhost:${PORT}/api/health\n`);
});
