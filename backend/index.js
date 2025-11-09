import express from 'express';
import cors from 'cors';
import connectDB from './db/connection.js';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/user.js';
import featureRoutes from './routes/feature.js';
import facilityRoutes from './routes/facility.js';
import roomsRoutes from './routes/room.js';
import clientRoomsRoutes from './routes/clientRoom.js';
import roomInstancesRoutes from './routes/roomInstance.js';

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public/uploads/icons'));
app.use(express.static('public/uploads/rooms'));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/features', featureRoutes);
app.use('/api/facility', facilityRoutes);
app.use('/api/rooms', roomsRoutes);
app.use('/api/room-instances', roomInstancesRoutes);
app.use('/api/client-rooms', clientRoomsRoutes);

app.listen(process.env.PORT, () =>{
    connectDB();
    console.log('Server is running on http://localhost:3000');
})