import express from "express";
import {
  updateCartItem,
  addToCart,
  clearCart,
  removeCartItem,
  getCartItems,
} from "../controllers/cartController.js";


const router = express.Router();

router.post("/add", addToCart); // Add to cart
router.get("/:id", getCartItems); // Get a user's cart
router.put("/update/:cartItemId", updateCartItem); // Update cart item quantity
router.delete("/remove/:cartItemId", removeCartItem); // Remove an item from the cart
router.delete("/clear/:userId", clearCart); // Clear the entire cart

export default router;