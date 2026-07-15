import express, { type Express, type Request, type Response, type NextFunction } from 'express';
import 'dotenv/config';
import cors from 'cors';
import mongoose from 'mongoose';
import analyzeRoute from './routes/Analysis.js';

const app: Express = express();
const PORT: string | number = process.env.PORT || 3000;

// Middleware configuration
app.use(cors());
app.use(express.json());

// Main Router API Registration
app.use('/api', analyzeRoute);

// Global Uncaught Exception Catch-All Handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Unhandled Server Exception Triggered:', err.stack);
  res.status(500).json({ error: 'An unexpected framework anomaly occurred on our side.' });
});

// Database Integration with Graceful Fallbacks
const mongoUri = process.env.MONGO_URI;
if (mongoUri) {
  mongoose.connect(mongoUri)
    .then(() => console.log('✓ Database Cluster initialized successfully.'))
    .catch((err: Error) => console.log('⚠️ Database Connection bypassed. Running in volatile live memory mode:', err.message));
} else {
  console.log('💡 No MONGO_URI variable detected. Running standalone without persistent logs storage.');
}

app.listen(PORT, () => {
  console.log(`🚀 Automated Backend Cluster online on internal port ${PORT}`);
});