import express from 'express';

import isAuthenticated from '../middleware/Auth.js'

import { createStudent,
        getStudents,
        getStudentById,
        deleteStudent,
        updateStudent
    } from '../controllers/Student.js'

const router = express.Router();

router.route('/').get(isAuthenticated, getStudents).post(isAuthenticated, createStudent);
router.route('/:id').get(isAuthenticated, getStudentById).delete(isAuthenticated,deleteStudent).put(isAuthenticated, updateStudent);

export default router;