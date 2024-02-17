import jwt from 'jsonwebtoken';
import { User } from '../models/ticketGenDB.js';

export const isAuthenticated = async (req, res, next) => {
    try {
        const { token } = req.cookies;
        if(!token) {
            return res.status(401).json({ success: false, message: "Login first to access this resource"})
        }
        

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        req.user = await User.findById(decoded._id);
        
        next();

    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ success: false, message: "Token expired" });
        }
        return res.status(500).json({ success: false, message: error.message });
    
    }
    
}