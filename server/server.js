import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import guestRoutes from './api/routes/routes.js';

const app = express();
const PORT = 8080;

// Middleware
app.use(cors());
app.use(express.json());

// --- connection MONGODB ATLAS ---

const ATLAS_URL = 'mongodb+srv://MRafiRamadhanK:mrrk271003@cluster0.rqcyqox.mongodb.net/hotel_guest_db?appName=Cluster0';

mongoose.connect(ATLAS_URL)
  .then(() => console.log('✅ connected to Mongodb Database!'))
  .catch((err) => console.error('❌ failed to connect to Atlas:', err));

// Routes
app.use('/api', guestRoutes);

app.listen(PORT, () => {
  console.log(`🚀 server running in http://localhost:${PORT}`);
});