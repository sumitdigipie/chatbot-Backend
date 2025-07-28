import express from 'express';
import dotenv from 'dotenv';
import aiRoutes from './routes/aiRoutes.js';
import cors from 'cors';

dotenv.config();

const app = express();
app.use(express.json());

console.log("Calling the server")

const allowedOrigins = [
  'https://todo-blush-phi.vercel.app',
  'https://chatbot-backend-indol-five.vercel.app',
  'http://localhost:5173'
];

app.use(cors({
  origin: true, // Allow all origins for now
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  optionsSuccessStatus: 200
}));

// Also add this to respond to OPTIONS preflight requests
app.options('*', cors());

// Debug endpoint to check CORS and origins
app.get('/api/debug', (req, res) => {
  res.json({
    origin: req.get('Origin'),
    referer: req.get('Referer'),
    userAgent: req.get('User-Agent'),
    headers: req.headers,
    timestamp: new Date().toISOString()
  });
});

app.use('/api/openai', aiRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
