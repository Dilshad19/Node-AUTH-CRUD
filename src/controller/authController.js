import User from "../model/authModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Signup Controller
export const signup = async (req, res) => {
  try {
    const userData = new User(req.body);
    const { email } = userData;
    const existUser = await User.findOne({ email });

    if (existUser) {
      res.status(400).json({ message: "User already exists" });
      return;
    }

    const savedUser = await userData.save();
    res.status(200).json(savedUser);
  } catch (error) {
    res.status(500).json({ message: error.message || error });
  }
};

// Login Controller
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const userExist = await User.findOne({ email });

    if (!userExist) {
      res.status(400).json({ message: "User does not exist" });
      return;
    }

    // Compare password with the database password
    const isValidPassword = await bcrypt.compare(password, userExist.password);
    if (!isValidPassword) {
      res.status(401).json({ message: "Email or password invalid" });
      return;
    }

    // Checking login status by token
    const tokenExist = req.cookies?.token;
    if (tokenExist) {
      res.status(400).json({ message: "Already logged in" });
      return;
    }

    // Generate token with user data and store in the cookie
    const token = jwt.sign({ userId: userExist._id }, process.env.SECRET_KEY || "default_secret", {
      expiresIn: "1h",
    });
    res.cookie("token", token, { httpOnly: true, maxAge: 3600000 });
    res.status(200).json({ message: "Login successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message || error });
  }
};

// Logout Controller
export const logout = async (req, res) => {
  try {
    // Checking login status using token
    const tokenExist = req.cookies?.token;
    if (!tokenExist) {
      res.status(400).json({ message: "Login required" });
      return;
    }

    // Clear cookie and token (logout)
    res.clearCookie("token");
    res.status(200).json({ message: "Logout successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message || error });
  }
};

// Update Controller
export const update = async (req, res) => {
  try {
    const { id } = req.params;
    const userExist = await User.findById(id);

    if (!userExist) {
      res.status(400).json({ message: "User does not exist" });
      return;
    }

    // Password hashing
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(req.body.password, salt);
    }

    // Update user data
    const updatedUser = await User.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message || error });
  }
};
