import jwt from "jsonwebtoken";
import User from "../models/user.js";

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) 
  // console.log("Header received:", req.headers.authorization);
  {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Decoded Token ID:", decoded.id);

      req.user = await User.findById(decoded.id).select("-password"); // attach user to request

      if (!req.user) {
         return res.status(401).json({ message: "User no longer exists" });
      }
      next();
    } catch (error) {
      console.error("JWT Verify Failed:", error.message);
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  }else {
     // If the if-statement fails immediately
     return res.status(401).json({ message: "Not authorized, no token" });
  }

  // if (!token) {
  //   return res.status(401).json({ message: "Not authorized, no token" });
  // }
};
