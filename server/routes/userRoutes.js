import express from "express";
import userAuth from "../middlewares/auth.js";
import {
  getAllBlogs,
  getUserDetails,
  getUserPostedBlogs,
  getUserProfileDetailsAndBlogs,
  signIn,
  signUp,
  userRefreshToken,
  logoutUser,
  createNewPost,
} from "../controllers/userController.js";
import { parser } from "../utils/multer.js";

const router = express.Router();

router.get("/blogs", getAllBlogs);

router.post("/signUp", signUp);

router.post("/signin", signIn);

router.get("/get-user", userAuth, getUserDetails);

router.get("/my-blogs", userAuth, getUserPostedBlogs);

router.get("/profile", userAuth, getUserProfileDetailsAndBlogs);

router.post("/create-blog", userAuth, parser.single("blogImage"), createNewPost);

router.post("/refresh-token", userRefreshToken);

router.delete("/logout", userAuth, logoutUser);

export default router;
