import { getProductById, getProducts, addProduct, updateProduct } from "../controllers/productController.js";
import express from "express";

const router = express.Router()

router.get("/all", getProducts); // Get all the products from the database
router.get("/:id", getProductById); // Get a product by ID
router.post("/add", addProduct);
router.put("/update/:id", updateProduct);

export default router;
