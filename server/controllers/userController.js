import UserModel from "../model/userModel.js";
import { passwordHashing } from "../utils/helper.js";

export const getAllBlogs = async (req, res) => {
  res.send("working");
};

export const signUp = async (req, res) => {
  const { fullName, lastName, email, password } = req.body;
  console.log("signup-body :", req.body);
  try {
    if (!fullName || !lastName || !email || !password)
      throw new Error("All fields required");

    const userExist = await UserModel.findOne({ email });
    if (userExist) throw new Error("User already exists with this email");

    const hashedPassword = passwordHashing(password);
    const createUser = await UserModel.create({
      fullName,
      lastName,
      email,
      password: hashedPassword,
    });

    if (!createUser)
      throw new Error("Error while creating user. Try after sometime");

    res.status(201).json(createUser);
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ error: error.message });
  }
};

export const signIn = async (req, res) => {};
