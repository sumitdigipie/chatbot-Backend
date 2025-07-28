import express from 'express';
import dotenv from 'dotenv';
import aiRoutes from './routes/aiRoutes.js';
import cors from 'cors';

dotenv.config();

const app = express();
app.use(express.json());

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin like curl or postman
    if (!origin) return callback(null, true);

    console.log('origin: ', origin);

    if (origin === "https://todo-blush-phi.vercel.app") {
      callback(null, true); // Origin allowed
    } else {
      callback(new Error('Not allowed by CORS')); // Origin NOT allowed
    }
  },
  methods: ["GET", "POST", "DELETE", "PUT", "PATCH", "OPTIONS"],
  credentials: true,
}));


app.use('/api/openai', aiRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
