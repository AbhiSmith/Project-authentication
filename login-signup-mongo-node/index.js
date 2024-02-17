// UUIDGEN3
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

import { connectDB } from './config/db.js';
import userRoutes from './routes/User.js'
import studentRouter from './routes/Student.js';

dotenv.config();

const app = express();

connectDB();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


app.use('/api/user', userRoutes);
app.use('/api/student', studentRouter);

app.use('/', (req, res) => {
    res.json({
        Responce :"Welcome to backend Login SignUP"
    })    
})


app.listen(process.env.PORT || 5000, () => {
    console.log(`Server is running on port ${process.env.PORT || 5000}`);
})