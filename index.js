// import express from "express";
// import dotenv from "dotenv";
// import mongoose from "mongoose";
// import cors from "cors";
// import bodyParser from "body-parser";
// import userRoutes from "./routes/userRoutes.js";
// import cartRoutes from "./routes/cartRoutes.js";
// import productRoutes from "./routes/productRoutes.js";
// import orderRoutes from "./routes/orderRoutes.js";

// dotenv.config(); //Loads environment variables

// //Initialize app
// const app = express();
// const port = 5000;

// //Middleware
// app.use(bodyParser.json()); // Parses incoming JSON data
// app.use(cors()); // Allows frontend to communicate with backend

// //Connect to mongoDB
// mongoose.connect(process.env.MONGO_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
// })
// .then(() => {
//     console.log("Connected to MongoDB...")
// })
// .catch((err) => {
//     console.log("MongoDB connection failed", err)
// })


// //Test route
// app.get("/", (req, res) => {
//     res.send("API is running...");
// });
// app.use("/api/users", userRoutes);
// app.use('/api/cart', cartRoutes);
// app.use('/api/products', productRoutes);
// app.use('/api/orders', orderRoutes);


// app.listen(port, () => {
//     console.log(`App is running on port ${port}`)
// })

import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import bodyParser from "body-parser";
import userRoutes from "./routes/userRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";

dotenv.config();

const app = express();
// 1. Dynamic Port for Hosting
const port = process.env.PORT || 5000;

// 2. Updated CORS for Production
const allowedOrigins = ["http://localhost:3000", "https://shopmart.vercel.app"];
app.use(cors({
    origin: allowedOrigins,
    credentials: true
}));

app.use(bodyParser.json());

// 3. Simplified MongoDB Connection (Modern Mongoose doesn't need the options anymore)
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("Connected to MongoDB Atlas..."))
.catch((err) => console.log("MongoDB connection failed", err));

// Routes
app.get("/", (req, res) => res.send("API is running..."));
app.use("/api/users", userRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

app.listen(port, () => {
    console.log(`Server live on port ${port}`);
});