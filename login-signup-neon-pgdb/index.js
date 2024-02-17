import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser';


import pool from './lib/db.js';
import userRouter from './routes/User.js'
import studentRouter from  './routes/Student.js'


dotenv.config();

const app = express();

app.use(cors({
    origin: '*',
}));
app.use(express.json());
app.use(cookieParser());

// Check neon db connection
async function getPgVersion() {
    const client = await pool.connect();
    try {
       
      const result = await client.query('SELECT version()');
    //   console.log(result.rows[0]);
    console.log("DB Sucssesfully connnected")
    } finally {
      client.release();
    }
  }
  getPgVersion();


app.use('/api/user', userRouter);
app.use('/api/student', studentRouter);

app.get('/', (req, res) => {
    res.json({
        Responce :"Welcome to backend Login SignUP",
        Name: "I'm Abhi Sing",
        From: "MIRZAPUR up"
    }) 
})
app.get('/health', (req, res) => {
    res.status(200).json({ Responce: "Server is running"})
})





app.listen(process.env.PORT || 8000, () => {
    
    console.log(`Server is running on port ${process.env.PORT || 8000}`);
   

    /// DB conection Are here

})