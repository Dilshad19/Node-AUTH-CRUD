import express from "express";
import { login, logout, signup, update } from "../controller/authController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const authRouter = express.Router();

// Define routes
authRouter.post("/signup", signup);
authRouter.post("/login", login);
authRouter.get("/logout", logout);
authRouter.put("/update/:id", authMiddleware, update);

export default authRouter;
