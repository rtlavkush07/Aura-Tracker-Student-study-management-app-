import jwt from "jsonwebtoken";
import userAuth from "../../models/userModels.js";

const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Log decoded token for debugging purposes
    // console.log("Decoded Token:", decoded);

    // Assuming you set the token payload as { id: user._id } during login
    req.user = { id: decoded.id };

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    console.error("Token verification failed:", error);
    res.status(401).json({ message: "Token is not valid" });
  }
};

export default authMiddleware;