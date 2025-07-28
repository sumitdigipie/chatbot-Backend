import express from 'express';
import dotenv from 'dotenv';
import aiRoutes from './routes/aiRoutes.js';
import cors from 'cors';

dotenv.config();

const app = express();
app.use(express.json());

// Define the CORS options
const corsOptions = {
  origin: 'https://todo-blush-phi.vercel.app', // only allow this origin
  credentials: true, // allow cookies and auth headers
  methods: ["GET", "POST", "DELETE", "PUT", "PATCH", "OPTIONS"],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
};

app.use(cors(corsOptions));


app.use('/api/openai', aiRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
