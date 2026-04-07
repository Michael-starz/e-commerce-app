import Product from "../models/product.js";

// Product Fetching
export const getProducts = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    const skip = (page - 1) * limit;
  
    const search = req.query.search || "";
    const category = req.query.category || "";
  
    const filter = {};
  
    //search term filter (case-insensitive)
    if (search) {
      filter.name = { $regex: search, $options: "i" };
    }
  
    //category filter if provided
    if (category) {
      filter.category = category;
    }
  
    try {
      const totalProducts = await Product.countDocuments(filter);
  
      const products = await Product.find(filter)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });
  
      res.status(200).json({
        products,
        currentPage: page,
        totalPages: Math.ceil(totalProducts / limit),
        totalProducts,
      });
    } catch (err) {
      res
        .status(500)
        .json({ message: "Error retrieving products", details: err.message });
    }
  };
  
  

// Fetch a product by ID
export const getProductById = async (req, res) => {
    try {
        // console.log("Looking for product with ID:", req.params.id);
        const product = await Product.findById(req.params.id)
        if (!product) {
            console.log("No product found!");
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json(product)
    } catch (err) {
        // console.error("Error fetching product:", err);
        res.status(500).json({ message: "Error retreiving item!", details: err });
    }
};


// Add a product to the database
export const addProduct = async (req, res) => {
    try {
        const { name, description, category, image, inStock, price } = req.body;

        const newProduct = new Product({ name, description, category, image, inStock, price });
        await newProduct.save()

        res.status(201).json({ newProduct, message: "Product added successfully"})

    } catch (err) {
        res.status(500).json({ message: "Error adding product!", details: err.message })
    }
}


// Update a product by ID
export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params; // product ID from URL
        const updates = req.body;  // updated fields from request body

        // Find the product by ID and apply updates
        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            { $set: updates }, // only update the fields provided
            { new: true, runValidators: true } // return updated doc + validate fields
        );

        if (!updatedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.status(200).json({
            message: "Product updated successfully",
            product: updatedProduct
        });
    } catch (err) {
        console.error("Error updating product:", err);
        res.status(500).json({
            message: "Failed to update product",
            error: err.toString()
        });
    }
};

