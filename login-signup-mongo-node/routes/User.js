import express from 'express';

//Controlers 
import { logout, signIN, signUp } from '../controllers/User.js'

const router = express.Router();

//ALL route are here 
router.route('/signup').post(signUp)
router.route('/signin').post(signIN);
router.route('/logout').get(logout);



export default router;