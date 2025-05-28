import express from 'express';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

dotenv.config();

const prisma = new PrismaClient();
const app = express();

app.use(express.json());

app.post('/identify', async (req, res) => {
  // TODO: Implement the identify logic here
  res.json({ message: 'identify endpoint - to be implemented' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
