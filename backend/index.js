import express from 'express';
import cors from 'cors';
import connectDB from './db/connection.js';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/user.js';
import featureRoutes from './routes/feature.js';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/features', featureRoutes);

app.listen(process.env.PORT, () =>{
    connectDB();
    console.log('Server is running on http://localhost:3000');
})