import express from 'express';
import dotenv from 'dotenv';
import aiRoutes from './routes/aiRoutes.js';
import cors from 'cors'
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors())

app.use('/api/openai', aiRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
