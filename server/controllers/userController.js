import jwt from "jsonwebtoken";
import BlogModel from "../model/blogModel.js";
import UserModel from "../model/userModel.js";
import {
  comparePassword,
  deleteCookieAfterLogout,
  generateAccessToken,
  generateRefreshToken,
  passwordHashing,
  setCookieOptions,
  validateImageFile,
} from "../utils/helper.js";
import mongoose from "mongoose";

export const getAllBlogs = async (req, res) => {
  try {
    const allBlogs = await BlogModel.find({})
      .sort({ updatedAt: -1 })
      .populate("userId");
    console.log("fetched all blogs");
    res.status(200).json(allBlogs);
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ error: error.message });
  }
};

export const getBlogDetails = async (req, res) => {
  const { blogId } = req.params;
  try {
    if (!mongoose.isValidObjectId(blogId))
      return res.status(404).json({ error: "Blog not found" });

    const blogExists = await BlogModel.findById(blogId).populate("userId");
    if (!blogExists) return res.status(404).json({ error: "Blog not found" });

    res.status(200).json(blogExists);
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ error: error.message });
  }
};

export const signUp = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  // console.log("signup-body :", req.body);
  try {
    if (!firstName || !lastName || !email || !password) {
      throw new Error("All fields required");
    }

    const userExist = await UserModel.findOne({ email });
    if (userExist) throw new Error("User already exists with this email");

    const hashedPassword = await passwordHashing(password);
    const createUser = await UserModel.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    if (!createUser)
      throw new Error("Error while creating user. Try after sometime");

    console.log("User Account Created For :", firstName);
    res.status(201).json(createUser);
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ error: error.message });
  }
};

export const signIn = async (req, res) => {
  const { email, password } = req.body;
  // console.log("login-body :", req.body);
  try {
    if (!email || !password) {
      throw new Error("All fields required");
    }

    const userExist = await UserModel.findOne({ email });
    if (!userExist) {
      return res.status(404).json({ error: "User Doesn't Exists" });
    }

    const passwordMatch = await comparePassword(password, userExist.password);
    if (!passwordMatch) {
      return res.status(403).json({ error: "Password is incorrect" });
    }

    const refreshToken = generateRefreshToken(userExist._id, userExist.email);
    const accessToken = generateAccessToken(userExist._id, userExist.email);
    // if (!token) {
    //   throw new Error("Something went wrong. Please try again after sometime");
    // }

    const cookieOptions = setCookieOptions();
    if (!cookieOptions) {
      throw new Error("Something went wrong. Please try again after sometime");
    }
    userExist.refreshToken = refreshToken;
    await userExist.save();

    console.log("User Logged In", email);
    res.cookie("accessToken", accessToken, cookieOptions);
    res.cookie("refreshToken", refreshToken, cookieOptions);
    res.status(200).json({ user: userExist, accessToken, refreshToken });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ error: error.message });
  }
};

export const getUserProfileDetailsAndBlogs = async (req, res) => {
  const userId = req.user._id;
  try {
    const userDetails = await UserModel.findById(userId);
    if (!userDetails) return res.status(404).json({ error: "User not Found" });

    const fetchBlogs = await BlogModel.find({ userId }).sort({ updatedAt: -1 });

    console.log("Fetched User Details & Blogs");
    res.status(200).json({ userDetails, blogs: fetchBlogs });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ error: error.message });
  }
};

export const getUserDetails = async (req, res) => {
  const userId = req.user._id;
  try {
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "user not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ error: error.message });
  }
};

export const createNewPost = async (req, res) => {
  try {
    const { title, description } = req.body;
    const blogImage = req?.file;
    const userId = req.user._id;

    if (!title || !description || !blogImage)
      return res.status(400).json({ error: "All fields required" });

    const imageError = validateImageFile(blogImage);
    if (imageError) return res.status(400).json({ error: imageError });

    const createBlog = await BlogModel.create({
      blogImage: blogImage.path,
      description,
      title,
      userId,
    });
    if (!createBlog)
      return res
        .status(400)
        .json({ error: "Something went wrong. Please try after sometime" });

    console.log("blog posted");
    res.status(200).json(createBlog);
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ error: error.message });
  }
};

export const updateBlog = async (req, res) => {
  const { _id, title, description, blogImage } = req.body;
  const newBlogImage = req?.file;
  console.log(req.body);
  if (!title || !description)
    return res.status(400).json({ error: "All fields required" });

  if (!newBlogImage && !blogImage)
    return res.status(400).json({ error: "Blog Image is required" });

  if (newBlogImage) {
    const imageError = validateImageFile(newBlogImage);
    if (imageError) return res.status(400).json({ error: imageError });
  }

  const updatedImage = newBlogImage ? newBlogImage.path : blogImage;

  const updateBlog = await BlogModel.findByIdAndUpdate(
    _id,
    {
      title,
      description,
      blogImage: updatedImage,
    },
    { new: true }
  );
  if (!updateBlog)
    return res
      .status(400)
      .json({ error: "Something went wrong. Please try after sometime" });

  console.log("Blog Updated");
  res.status(200).json(updateBlog);
  try {
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ error: error.message });
  }
};

export const getUserPostedBlogs = async (req, res) => {
  const userId = req.user._id;
  try {
    const blogs = await BlogModel.find({ userId }).sort({ updatedAt: -1 });
    res.status(200).json(blogs);
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ error: error.message });
  }
};

export const removeUserBlog = async (req, res) => {
  const userId = req.user._id;
  const { blogId } = req.params;

  try {
    const blogExists = await BlogModel.findById(blogId);
    if (!blogExists) return res.status(404).json({ error: "Blog not found" });

    if (blogExists.userId.toString() !== userId.toString())
      return res
        .status(403)
        .json({ error: "You are not authorized to delete this post" });

    const deleteBlog = await BlogModel.findByIdAndDelete(blogId);
    if (!deleteBlog)
      return res
        .status(400)
        .json({ error: "Something went wrong. Please try after sometime" });

    console.log("Blog Deleted");
    res.status(200).json({ message: "Blog Deleted Successfully" });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ error: error.message });
  }
};

export const userRefreshToken = async (req, res) => {
  const incomingRefreshToken = req.cookies?.refreshToken;
  // console.log("refreshToken from frontend :", incomingRefreshToken);
  const cookieOptions = setCookieOptions();
  try {
    const decoded = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await UserModel.findById(decoded?.id);

    if (!user) {
      return res.status(400).json({ error: "user not found" });
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      return res.status(400).json({ error: "Invalid Refresh Token" });
    }

    const accessToken = generateAccessToken(user._id, user.email);

    console.log("acccess token refreshed");
    res.cookie("accessToken", accessToken, cookieOptions);
    res.cookie("refreshToken", incomingRefreshToken, cookieOptions);
    res.status(200).json({ accessToken, refreshToken: incomingRefreshToken });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ error: error.message });
  }
};

export const logoutUser = async (req, res) => {
  const token = req.cookies?.refreshToken;
  try {
    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);

    const user = await UserModel.findById(decoded?.id);

    if (!user) {
      throw new Error("user doesn't exists - RefreshToken");
    }

    if (token !== user?.refreshToken) {
      throw new Error("Invalid Refresh Token");
    }

    user.refreshToken = null;
    await user.save({ validateBeforeSave: false });

    const response = deleteCookieAfterLogout(res);
    console.log("User logged out", decoded.email);
    response.status(200).json({ message: "logged out successfully" });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ error: error.message });
  }
};
