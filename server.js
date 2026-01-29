const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const JWT_SECRET = "your-secret-key-change-in-production";

// 1. Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/storeDB")
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.log("Connection Error:", err));

// 2. User Schema
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'user'], default: 'user' },
    createdAt: { type: Date, default: Date.now }
});

// 3. Product Schema
const productSchema = new mongoose.Schema({
    name: String,
    price: Number,
    category: String,
    stock: Number,
    isAvailable: Boolean,
    image: String, // Store image URL or path
    description: String
});

// 4. Cart Schema
const cartSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name: String,
    price: Number,
    quantity: Number,
    image: String
});

// 5. Order Schema
const orderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    items: [{
        productId: mongoose.Schema.Types.ObjectId,
        name: String,
        price: Number,
        quantity: Number
    }],
    totalAmount: Number,
    customerName: String,
    email: String,
    address: String,
    phone: String,
    orderDate: { type: Date, default: Date.now },
    status: { type: String, default: 'Pending' }
});

// Create Models
const User = mongoose.model("User", userSchema);
const Product = mongoose.model("Product", productSchema);
const Cart = mongoose.model("Cart", cartSchema);
const Order = mongoose.model("Order", orderSchema);

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid or expired token' });
        }
        req.user = user;
        next();
    });
};

// Middleware to verify admin role
const isAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Admin access required' });
    }
    next();
};

// ============ AUTH ROUTES ============

// Register
app.post("/api/auth/register", async (req, res) => {
    try {
        const { username, email, password, role } = req.body;

        // Check if user exists
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(400).json({ error: 'Username or email already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = new User({
            username,
            email,
            password: hashedPassword,
            role: role || 'user'
        });

        await user.save();

        // Generate token
        const token = jwt.sign(
            { id: user._id, username: user.username, role: user.role },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(201).json({
            message: 'User registered successfully',
            token,
            user: { id: user._id, username: user.username, email: user.email, role: user.role }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Login
app.post("/api/auth/login", async (req, res) => {
    try {
        const { username, password } = req.body;

        // Find user
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        // Check password
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        // Generate token
        const token = jwt.sign(
            { id: user._id, username: user.username, role: user.role },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            message: 'Login successful',
            token,
            user: { id: user._id, username: user.username, email: user.email, role: user.role }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get current user
app.get("/api/auth/me", authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ============ PRODUCT ROUTES ============

// GET all products (public)
app.get("/api/products", async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET single product (public)
app.get("/api/products/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }
        res.json(product);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST create product (admin only)
app.post("/api/products", authenticateToken, isAdmin, async (req, res) => {
    try {
        const product = new Product(req.body);
        const result = await product.save();
        res.status(201).json(result);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// PUT update product (admin only)
app.put("/api/products/:id", authenticateToken, isAdmin, async (req, res) => {
    try {
        const result = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!result) {
            return res.status(404).json({ error: "Product not found" });
        }
        res.json(result);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// DELETE product (admin only)
app.delete("/api/products/:id", authenticateToken, isAdmin, async (req, res) => {
    try {
        const result = await Product.findByIdAndDelete(req.params.id);
        if (!result) {
            return res.status(404).json({ error: "Product not found" });
        }
        res.json({ message: "Product deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ============ CART ROUTES (User) ============

// GET user's cart
app.get("/api/cart", authenticateToken, async (req, res) => {
    try {
        const cartItems = await Cart.find({ userId: req.user.id });
        res.json(cartItems);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST add to cart
app.post("/api/cart", authenticateToken, async (req, res) => {
    try {
        const { productId, name, price, quantity, image } = req.body;

        const existingItem = await Cart.findOne({
            userId: req.user.id,
            productId
        });

        if (existingItem) {
            existingItem.quantity += quantity;
            await existingItem.save();
            res.json(existingItem);
        } else {
            const cartItem = new Cart({
                userId: req.user.id,
                productId,
                name,
                price,
                quantity,
                image
            });
            const result = await cartItem.save();
            res.status(201).json(result);
        }
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// PUT update cart item
app.put("/api/cart/:id", authenticateToken, async (req, res) => {
    try {
        const { quantity } = req.body;
        const result = await Cart.findOneAndUpdate(
            { _id: req.params.id, userId: req.user.id },
            { quantity },
            { new: true }
        );
        res.json(result);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// DELETE cart item
app.delete("/api/cart/:id", authenticateToken, async (req, res) => {
    try {
        await Cart.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
        res.json({ message: "Item removed from cart" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE clear cart
app.delete("/api/cart", authenticateToken, async (req, res) => {
    try {
        await Cart.deleteMany({ userId: req.user.id });
        res.json({ message: "Cart cleared" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ============ ORDER ROUTES ============

// POST create order (user)
app.post("/api/orders", authenticateToken, async (req, res) => {
    try {
        const orderData = {
            ...req.body,
            userId: req.user.id
        };
        const order = new Order(orderData);
        const result = await order.save();

        await Cart.deleteMany({ userId: req.user.id });

        res.status(201).json(result);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// GET user's orders
app.get("/api/orders/my-orders", authenticateToken, async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.user.id }).sort({ orderDate: -1 });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET all orders (admin only)
app.get("/api/orders", authenticateToken, isAdmin, async (req, res) => {
    try {
        const orders = await Order.find().sort({ orderDate: -1 });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT update order status (admin only)
app.put("/api/orders/:id", authenticateToken, isAdmin, async (req, res) => {
    try {
        const { status } = req.body;
        const result = await Order.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );
        res.json(result);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// ============ ADMIN STATS ============

app.get("/api/admin/stats", authenticateToken, isAdmin, async (req, res) => {
    try {
        const totalProducts = await Product.countDocuments();
        const totalOrders = await Order.countDocuments();
        const totalUsers = await User.countDocuments({ role: 'user' });
        const totalRevenue = await Order.aggregate([
            { $group: { _id: null, total: { $sum: "$totalAmount" } } }
        ]);

        res.json({
            totalProducts,
            totalOrders,
            totalUsers,
            totalRevenue: totalRevenue[0]?.total || 0
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://127.0.0.1:${PORT}`);
});