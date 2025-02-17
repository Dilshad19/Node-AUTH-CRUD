import jwt from "jsonwebtoken";

export const authMiddleware = async (req, res, next) => {
  // Checking login status by token
  const token = req.cookies?.token; // Use optional chaining for safety
  const id = req.params.id;

  if (!token) {
    res.status(400).json({ message: "Login first" });
    return;
  }

  try {
    // Verify token if the user is logged in
    const decodedToken = jwt.verify(
      token,
      process.env.SECRET_KEY || "default_secret_key"
    );

    req.userId = decodedToken.userId;

    // Checking authorization of the user
    if (id !== decodedToken.userId) {
      res.status(400).json({ message: "Access denied" });
      return;
    }

    next();
  } catch (error) {
    res.status(500).json({ error: error.message || error });
  }
};
