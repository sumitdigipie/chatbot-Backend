import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import aiRoutes from './routes/aiRoutes.js';
import chatRoutes from './routes/mcpRoutes.js';

dotenv.config();

const app = express();
app.use(express.json());

app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  optionsSuccessStatus: 200
}));

app.options('*', cors());

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
// app.use('/api/mcp', mcpRoutes);
app.use("/api", chatRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});
