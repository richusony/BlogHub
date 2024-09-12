import express from "express";
import { getAllBlogs, signIn, signUp } from "../controllers/userController.js";

const router = express.Router();

router.get("/blogs", getAllBlogs);

router.post("/signUp", signUp);

router.post("/signin", signIn);


export default router;