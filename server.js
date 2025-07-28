import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();

// Middleware
app.use(express.json());

// CORS configuration
app.use(cors({
  origin: true, // Allow all origins for now
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  optionsSuccessStatus: 200
}));

// Handle preflight requests
app.options('*', cors());

// Debug endpoint
app.get('/api/debug', (req, res) => {
  res.json({
    origin: req.get('Origin'),
    referer: req.get('Referer'),
    userAgent: req.get('User-Agent'),
    headers: req.headers,
    timestamp: new Date().toISOString()
  });
});

// Import and use AI routes after all middleware is set up
import aiRoutes from './routes/aiRoutes.js';
app.use('/api/openai', aiRoutes);

console.log('Server setup complete');

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
