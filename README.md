# 🛍️ E-Commerce Management System

A full-stack e-commerce web application with secure authentication, role-based access control, shopping cart functionality, and order management.

![Node.js](https://img.shields.io/badge/Node.js-v14+-green)
![MongoDB](https://img.shields.io/badge/MongoDB-v5.0+-green)
![Express.js](https://img.shields.io/badge/Express.js-v4.18-blue)

## 🛠️ Tech Stack

### Frontend
- **HTML5** - Structure and markup
- **CSS3** - Styling and animations
- **JavaScript (ES6+)** - Client-side logic
- **Fetch API** - HTTP requests

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM

### Security
- **bcrypt** - Password hashing
- **JSON Web Token (JWT)** - Authentication
- **CORS** - Cross-origin resource sharing

## 📦 Prerequisites

Before running this project, ensure you have the following installed:

- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (v5.0 or higher) - [Download](https://www.mongodb.com/try/download/community)
- **npm** (comes with Node.js)
- **Git** (optional) - [Download](https://git-scm.com/)

Check your installations:
```bash
node --version
npm --version
mongod --version
```

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/lishanthreddy/ecommerce-project.git
cd ecommerce-project
```

Or download and extract the ZIP file.

### 2. Install Dependencies

```bash
npm install
```

This will install:
- express
- mongoose
- cors
- bcrypt
- jsonwebtoken

### 3. Start MongoDB

**Windows:**
```bash
mongod
```

**Mac/Linux:**
```bash
sudo systemctl start mongod
```

Or run MongoDB as a service in the background.

### 4. Create Project Structure

Ensure your project structure looks like this:

```
ecommerce-project/
├── server.js
├── package.json
├── public/
│   └── index.html
└── README.md
```

### 5. Start the Server

```bash
npm start
```

Or for development with auto-restart:
```bash
npm run dev
```

The server will start at `http://127.0.0.1:3000`

## ⚙️ Configuration

### Environment Variables (Optional)

Create a `.env` file in the root directory:

```env
PORT=3000
MONGODB_URI=mongodb://127.0.0.1:27017/storeDB
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRE=24h
```

Update `server.js` to use environment variables:

```javascript
require('dotenv').config();

const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/storeDB';
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
```

Install dotenv:
```bash
npm install dotenv
```

### Database Configuration

The default database name is `storeDB`. To change:

1. Update in `server.js`:
```javascript
mongoose.connect("mongodb://127.0.0.1:27017/your-db-name")
```

2. Update in `public/index.html`:
```javascript
const API_URL = 'http://127.0.0.1:3000/api';
```

## 📖 Usage

### First Time Setup

1. **Access the Application**
   - Open browser: `http://127.0.0.1:3000`

2. **Create Admin Account**
   - Click "Register"
   - Fill in details
   - Select role: "Admin (Store Manager)"
   - Click "Register"

3. **Login as Admin**
   - Enter credentials
   - You'll be redirected to Admin Panel

4. **Add Products**
   - Click "+ Add Product"
   - Fill in product details
   - Add image URL (optional)
   - Click "Save Product"

5. **Create User Account**
   - Logout from admin
   - Register new account as "User (Customer)"
   - Login to access shop

### Admin Workflow

```
Login → Dashboard → Manage Products/Orders
├── Add Products
├── Edit Products
├── Delete Products
├── View Orders
└── Update Order Status
```

### User Workflow

```
Login → Browse Products → Add to Cart → Checkout → Place Order
```

## 📁 Project Structure

```
ecommerce-project/
├── server.js                 # Backend server and API routes
├── package.json             # Dependencies and scripts
├── public/
│   └── index.html          # Frontend application
├── README.md               # Project documentation
├── .gitignore             # Git ignore file
└── .env                   # Environment variables (optional)
```

### Key Files

**server.js** - Main backend file containing:
- MongoDB connection
- User, Product, Cart, Order schemas
- Authentication middleware
- All API endpoints
- Server configuration

**public/index.html** - Complete frontend containing:
- Login/Register pages
- Admin panel
- User shop interface
- Shopping cart
- All JavaScript logic

## 🐛 Troubleshooting

### Common Issues

**1. MongoDB Connection Error**
```
Error: Connection Error: connect ECONNREFUSED
```
**Solution:** Ensure MongoDB is running
```bash
mongod
```

**2. Port Already in Use**
```
Error: listen EADDRINUSE: address already in use :::3000
```
**Solution:** Kill the process or use different port
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:3000 | xargs kill -9
```

**3. Module Not Found**
```
Error: Cannot find module 'express'
```
**Solution:** Install dependencies
```bash
npm install
```

**4. CORS Error**
```
Access to fetch blocked by CORS policy
```
**Solution:** Ensure CORS is enabled in server.js
```javascript
app.use(cors());
```

**5. JWT Token Invalid**
```
Error: Invalid or expired token
```
**Solution:** Login again to get new token

## 🔮 Future Enhancements

- [ ] Payment gateway integration (Razorpay/Stripe)
- [ ] Product image upload functionality
- [ ] Advanced search and filtering
- [ ] Product reviews and ratings
- [ ] Email notifications
- [ ] Wishlist feature
- [ ] Order tracking system
- [ ] Multi-language support
- [ ] Dark mode theme
- [ ] Analytics and reporting
- [ ] Export orders to CSV/PDF
- [ ] Inventory alerts
- [ ] Promotional codes/coupons
- [ ] Social media login
- [ ] Real-time chat support

### Coding Standards

- Use meaningful variable names
- Comment complex logic
- Follow ES6+ syntax
- Maintain consistent indentation
- Write clean, readable code

## 📧 Contact

For questions or support, please contact:

- **Email:** lishanthreddy07@gmail.com
- **GitHub:** [@lishanthreddy](https://github.com/lishanthreddy)
- **LinkedIn:** [lishanthreddy](https://linkedin.com/in/lishanthreddy)

## 📚 Resources

- [Node.js Documentation](https://nodejs.org/docs/)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [MongoDB Manual](https://docs.mongodb.com/manual/)
- [Mongoose Documentation](https://mongoosejs.com/docs/)
