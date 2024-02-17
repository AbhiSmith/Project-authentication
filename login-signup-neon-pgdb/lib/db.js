import pkt from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pkt;

// console.log("dbSring=>",process.env.CONNECTION_STRING);

const pool = new Pool({    
    connectionString: process.env.CONNECTION_STRING,
    ssl: {
        rejectUnauthorized: false
    }
})
export default pool;
