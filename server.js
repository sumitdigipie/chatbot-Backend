import express from 'express';
import dotenv from 'dotenv';
import aiRoutes from './routes/aiRoutes.js';
import cors from 'cors';

dotenv.config();

const app = express();
app.use(express.json());

app.use(cors({
  // origin: "http://localhost:5173", // ✅ no slash
  origin: "https://todo-blush-phi.vercel.app" || "http://localhost:5173", // ✅ no slash
  methods: ["GET", "POST", "DELETE", "PUT", "PATCH", "OPTIONS"],
  credentials: true, // Optional
}));

app.use('/api/openai', aiRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
