import Cart from "../models/cart.js";
import Product from "../models/product.js";

// Adds item to cart
export const addToCart = async (req, res) => {
    try {
        const { userId, productId, quantity } = req.body;

        // Check if product exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found!"});
        }

        if (quantity > product.inStock) {
            console.log(`Sorry, ${product.name} is currently out of stock`, "available:" `${product.inStock}`)
            return res.status(409).json({ 
                message: `Sorry, ${product.name} is currently out of stock`, 
                available: `${product.inStock}`
            })
        }

        // Check if the item already exists in the user's cart
        let cartItem = await Cart.findOne({ userId, productId });
        if (cartItem) {
            // If the product is already in the cart, update the quantity
            cartItem.quantity += quantity;
        } else {
            cartItem = new Cart({
                userId,
                productId,
                quantity,
                priceAtTime: product.price
            });
        }

        await cartItem.save();
        res.status(201).json({ _id: cartItem._id, message: "Item added to cart", cartItem});
    } catch (err) {
        res.status(500).json({ message: "Error adding to cart", details: err.message });
    }
};


// Get all items in a user's cart
export const getCartItems = async (req, res) => {
    try {
        const userId = req.params.id;
        // console.log('Getting cart items for id:', req.params.id)
        const cartItems = await Cart.find({ userId, ordered: false }).populate("productId");
        res.status(200).json(cartItems);
    } catch (err) {
        res.status(500).json({ message: "Error retrieving cart items", details: err})
    }
};


// Update item quantity in cart
export const updateCartItem = async (req, res) => {
    try {
      const { cartItemId } = req.params;
      const { quantity } = req.body;
  
      if (quantity < 1) {
        return res.status(400).json({ message: "Quantity must be at least 1" });
      }
  
      const cartItem = await Cart.findById(cartItemId).populate("productId");
      if (!cartItem) {
        return res.status(404).json({ message: "Cart item not found" });
      }
  
      cartItem.quantity = quantity; // ✅ Set directly
      await cartItem.save();
  
      res.status(200).json({ message: "Cart item updated", cartItem });
    } catch (err) {
      res.status(500).json({ message: "Error updating cart", details: err.message });
    }
  };
  


// Remove an item from the cart
export const removeCartItem = async (req, res) => {
    try {
        const { cartItemId } = req.params;

        const cartItem = await Cart.findById(cartItemId);
        if (!cartItem) {
            return res.status(404).json({ message: "Cart item not found" });
        }

        await cartItem.deleteOne();
        res.status(200).json({ message: "Cart item removed" });
    } catch (err) {
        res.status(500).json({ message: "Error removing cart item", details: err.message });
    }
};


// Clear the cart when an order is placed
export const clearCart = async (req, res) => {
    try {
        const { userId } = req.params;

        await Cart.deleteMany({ userId });
        res.status(200).json({ message: "Cart cleared successfully" });
    } catch (err) {
        res.status(500).json({ message: "Error clearing cart", details: err.message })
    }
};