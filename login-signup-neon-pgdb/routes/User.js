import express from "express";

import { deletAllUser, getAllUSer, signIn, signUp } from "../controller/User.js";

const router = express.Router();

router.route("/").get(getAllUSer);
router.route("/drop").get(deletAllUser)

router.route('/signup').post(signUp)
router.route('/login').post(signIn)


export default router;