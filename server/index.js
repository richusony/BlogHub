import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import express from "express";
import cookieParser from "cookie-parser";
import { connectMongoDB } from "./dbConnection.js";

import userRoute from "./routes/userRoutes.js";

const app = express();
const PORT = process.env.PORT || 8080;
const MONGODB_URI = process.env.MONGODB_URI;

connectMongoDB(MONGODB_URI);

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.json());

app.use("/", userRoute);

app.listen(PORT,()=>{
    console.log("listening on",PORT);
})