import pool from "../lib/db.js"
import jwt from "jsonwebtoken"
// import {} from 'cookie-parser'




export const getAllUSer = async (req, res) => {
    try {
        const client = await pool.connect();
        console.log("Connected to database");
        const result = await client.query("SELECT * FROM users");

        res.json(result.rows);
        client.release();

    } catch (error) {
        console.error('Error executing query', error);
        res.status(500).json({ message: "Server error" });
    }
}

export const deletAllUser = async (req, res) => {
    try {
        const client = await pool.connect();
        const result = await client.query("DELETE FROM users");
        res.json({ message: "Delete all data from user"});
        client.release();
    } catch (error) {
        console.error('Error executing query', error);
        res.status(500).json({ message: "Server error" });
    }
}

export const signUp = async (req, res) => {
    try {
        const { email, password, confirmPassword, firstName, lastName } = req.body;
        if (!email || !password || !confirmPassword || !firstName || !lastName) {
            return res.status(400).json({ message: "All fields are required" })
        }
        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match" })
        }

        const client = await pool.connect();
        // Check if a user with the provided email already exists
        const query = 'SELECT * FROM users WHERE email = $1';
        const { rows } = await pool.query(query, [email]);
        const name = `${firstName} ${lastName}`
        // If a user with the email already exists, return an error response
        if (rows.length > 0) {
            return res.status(400).json({ message: 'Email already exists' });
        }
        // Insert user data into the database
        const INsertQuery = await pool.query('INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *', [name, email, password]);
        
        const token = jwt.sign({ email: INsertQuery.email, id: INsertQuery._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_COOKIE_EXPIRE });
        res.cookie('token', token, { httpOnly: true, maxAge: 3600000 });
        res.status(201).json({ message: "User created successfully", token });
        client.release();
    } catch (error) {
        console.error('Error executing query', error);
        res.status(500).json({ message: "Server error" });
    }
}

export const signIn = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" })            
        }
        const client = await pool.connect();
        const { rows } =await client.query('SELECT * FROM users WHERE email = $1', [email]);
        client.release(); 
        if (rows.length === 0) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        // Assuming each email is unique, we'll only have one row in the rows array
        const user = rows[0];
        
        if(user.password !== password) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        
        const token = jwt.sign({ email: user.email, id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_COOKIE_EXPIRE });
        res.cookie('token', token, { httpOnly: true, maxAge: 3600000 });
        res.status(200).json({ result: user, token });
        
    } catch (error) {
        console.error('Error executing query', error);
        res.status(500).json({ message: "Server error" });       
    }
}