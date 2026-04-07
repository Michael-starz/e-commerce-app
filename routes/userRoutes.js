import express from "express";
import {
  registerUser,
  loginUser,
  updateUserDetails,
  getUsers,
  resetPassword,
  changePassword,
  getUserById
} from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.put("/:id/update-details", protect, updateUserDetails);
router.get("/all", protect, getUsers);
router.patch("/change-password/:id", protect, changePassword);
router.post("/reset-password", resetPassword);
router.get("/:userId", protect, getUserById);

export default router;
