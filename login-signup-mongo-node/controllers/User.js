import bcrypt, { genSalt } from 'bcrypt';
import jwt from 'jsonwebtoken';

import User from '../models/Users.js'



export const signIN = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" })
        }
        const existingUser = await User.findOne({ email });

        if (!existingUser) {
            return res.status(404).json({ message: "User not found" })
        }
        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Invalid credentials" })
        }
        const token = jwt.sign({ email: existingUser.email, id: existingUser._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_COOKIE_EXPIRE });
        res.status(200).json({ result: existingUser, token })
    } catch (error) {
        res.status(500).json({ message: "Something went wrong" })
        console.log(error)        
        
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
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists please signIn" })
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const result = await User.create({ email, password: hashedPassword, name: `${firstName} ${lastName}` })
        const token = jwt.sign({ email: result.email, id: result._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_COOKIE_EXPIRE });
        res.status(200).json({ result, token })
        
    } catch (error) {
        res.status(500).json({ message: "Something went wrong" })
        console.log(error)
    }
}

export const logout = async (req, res) => {
    res.clearCookie('token');
    res.status(200).json({ message: "User logged out" })
    console.log("User logged out")
}