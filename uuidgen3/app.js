import express from "express";
import User from "./routes/User.js"
import cookieParser from "cookie-parser";




export const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


app.use("/api/v1/", User)
