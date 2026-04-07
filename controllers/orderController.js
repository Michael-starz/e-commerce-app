import Order from "../models/order.js";
import orderDetails from "../models/orderDetails.js";
import Cart from "../models/cart.js";
import Product from "../models/product.js";

export const addOrder = async (req, res) => {
  try {
    const { userId, voucherCode, shipping } = req.body;
    const statuses = [
      "Pending",
      "Shipped",
      "Fulfilled",
      "Ready to pickup",
      "Cancelled",
    ];
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
    const cartItems = await Cart.find({ userId, ordered: false }).populate(
      "productId"
    );

    const deliveryMethodMap = {
      free_shipping: "Free Shipping",
      two_days_shipping: "Two Days Shipping",
      standard_shipping: "Standard Shipping",
      one_day_shipping: "One Day Shipping",
    };
    const rawMethod = req.body.deliveryMethod || "standard_shipping";
    const deliveryMethod = deliveryMethodMap[rawMethod] || "Standard Shipping";

    // Check inventory
    for (const item of cartItems) {
      const product = item.productId;

      if (item.quantity > product.inStock) {
        return res.status(409).json({
          message: `Sorry, ${product.name} is currently out of stock. Only ${product.inStock} available.`,
          available: product.inStock,
        });
      }
    }
    if (cartItems.length === 0) {
      return res.status(400).json({ message: "No items in cart to order" });
    }

    // Calculate subtotal
    const subtotal = cartItems.reduce((sum, item) => {
      return sum + item.productId.price * item.quantity;
    }, 0);

    const tax = parseFloat((subtotal * 0.07).toFixed(2));
    // const shipping = parseFloat((subtotal * 0.03).toFixed(2));
    const discount =
      voucherCode === "EASTER" ? parseFloat((subtotal * 0.05).toFixed(2)) : 0;
    const totalPrice = parseFloat(
      (subtotal + tax + shipping - discount).toFixed(2)
    );

    // Reduce inStock quantity
    for (const item of cartItems) {
      const product = item.productId;
      product.inStock -= item.quantity;
      await product.save();
    }

    // Save new order
    const order = new Order({
      userId,
      subtotal,
      tax,
      shipping,
      discount,
      voucherCode: voucherCode || null,
      totalPrice,
      status: randomStatus,
      deliveryMethod,
    });

    const savedOrder = await order.save();

    // Create OrderDetails
    const bulkOrder = cartItems.map((item) =>
      new orderDetails({
        orderId: savedOrder._id,
        productId: item.productId._id,
        quantity: item.quantity,
        priceAtPurchase: item.productId.price,
        itemSubtotal: item.productId.price * item.quantity,
      }).save()
    );

    // Mark cart items as ordered
    const cartUpdates = cartItems.map((item) => {
      item.ordered = true;
      return item.save();
    });

    await Promise.all([Promise.all(bulkOrder), Promise.all(cartUpdates)]);

    res.status(201).json({
      orderId: savedOrder._id,
      message: "Order placed successfully",
    });
  } catch (err) {
    console.error("Order creation failed:", err);
    res
      .status(500)
      .json({ message: "Error placing order", error: err.toString() });
  }
};

export const getUserOrderHistory = async (req, res) => {
  const userId = req.params.id;
  // console.log("Getting order history for ID:", userId);
  const page = parseInt(req.query.page) || 1; // Current page
  const limit = parseInt(req.query.limit) || 5; // Orders per page
  const skip = (page - 1) * limit; // How many to skip

  try {
    // Count total number of orders (for pagination)
    const totalOrders = await Order.countDocuments({ userId });
    // console.log("Total order:", totalOrders);

    // Fetch paginated orders
    const orders = await Order.find({ userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Process each order
    const orderHistory = await Promise.all(
      orders.map(async (order) => {
        const details = await orderDetails
          .find({ orderId: order._id })
          .populate("productId");

        const totalItems = details.reduce(
          (sum, item) => sum + item.quantity,
          0
        );

        const products = details.map((detail) => ({
          productId: detail.productId?._id,
          name: detail.productId?.name,
          image: detail.productId?.image,
          price: detail.productId?.price,
          quantity: detail.quantity,
        }));

        return {
          orderId: order._id,
          orderDate: new Date(order.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
          status: order.status || "Pending",
          totalItems,
          totalAmount: order.totalPrice,
          products,
          deliveryMethod: order.deliveryMethod,
          discountAmount: order.discount,
          tax: order.tax,
          shipping: order.shipping,
        };
      })
    );

    // Return paginated results with metadata
    res.status(200).json({
      currentPage: page,
      totalPages: Math.ceil(totalOrders / limit),
      totalOrders,
      orders: orderHistory,
    });
  } catch (error) {
    console.error("Error getting order history:", error);
    res.status(500).json({
      message: "Failed to get order history",
      error: error.toString(),
    });
  }
};
