import mongoose from "mongoose";

const orderDetailsSchema = new mongoose.Schema(
    {
        orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        quantity: { type: Number, required: true },
        discountAmount: { type: Number, default: 0 },
        priceAtPurchase: { type: Number, required: true }, // Store at time of purchase
        itemSubtotal: { type: Number, required: true }, // quantity * priceAtPurchase
    }, 
    { timestamps: true }
);

const orderDetails = mongoose.model("orderDetails", orderDetailsSchema)
export default orderDetails