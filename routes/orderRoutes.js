import express from "express";
import { addOrder, getUserOrderHistory } from "../controllers/orderController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post('/add', addOrder);
router.get('/history/:id', protect, getUserOrderHistory);

export default router;
