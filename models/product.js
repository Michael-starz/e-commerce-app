import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        description: { type: String, required: true },
        price: { type: Number, required: true },
        category: { type: String, required: true },
        image: { type: String, required: true },
        inStock: { type: Number, default: 0 },
        rating: { type: Number, default: 3 }
    },
    { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
export default Product;


