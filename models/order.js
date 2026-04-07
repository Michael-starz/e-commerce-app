import mongoose from "mongoose";


const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    orderDate: { type: Date, default: Date.now },
    status: { type: String, default: "Pending", required: true },
    deliveryMethod: { type: String, default: "Standard shipping", required: true },
    
    subtotal: { type: Number, required: true },      // New
    tax: { type: Number, required: true },            // New
    shipping: { type: Number, required: true },       // New
    discount: { type: Number, default: 0 },           // New
    voucherCode: { type: String, default: null },     // New
    totalPrice: { type: Number, required: true },     // Already exists
  },
  { timestamps: true }
);


const Order = mongoose.model("Order", orderSchema);
export default Order;