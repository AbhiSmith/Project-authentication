import express from 'express';
import { getStudent } from '../controller/student1.js';

import isAuthenticated from '../middleware/Auth.js';



const router = express.Router();


router.route('/stu').get(isAuthenticated, getStudent)


export default router;

