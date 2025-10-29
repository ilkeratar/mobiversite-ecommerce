const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;
const DB_FILE = path.join(__dirname, 'db.json');

// Middleware
app.use(cors());
app.use(express.json());

// Helper function to read DB
const readDB = () => {
  try {
    const data = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading database:', error);
    return { products: [], users: [], categories: [], orders: [] };
  }
};

// Helper function to write DB
const writeDB = (data) => {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Error writing database:', error);
    return false;
  }
};

// Health check
app.get('/', (req, res) => {
  res.json({ 
    message: 'Mobiversite E-Commerce API', 
    status: 'running',
    endpoints: {
      products: 'GET /products, GET /products/:id',
      users: 'GET /users, GET /users/:id, POST /users, PUT /users/:id, PATCH /users/:id',
      orders: 'GET /orders, GET /orders/:id, POST /orders',
      categories: 'GET /categories'
    }
  });
});

// ==================== PRODUCTS ====================

// Get all products with filtering
app.get('/products', (req, res) => {
  const db = readDB();
  let products = db.products || [];
  
  // Filter by category
  if (req.query.category) {
    products = products.filter(p => p.category === req.query.category);
  }
  
  // Filter by multiple IDs (for wishlist)
  if (req.query.id) {
    const ids = Array.isArray(req.query.id) 
      ? req.query.id.map(id => parseInt(id))
      : [parseInt(req.query.id)];
    products = products.filter(p => ids.includes(p.id));
  }
  
  // Pagination
  const page = parseInt(req.query._page) || 1;
  const limit = parseInt(req.query._limit) || products.length;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  
  const paginatedProducts = products.slice(startIndex, endIndex);
  
  res.json(paginatedProducts);
});

// Get single product
app.get('/products/:id', (req, res) => {
  const db = readDB();
  const product = db.products.find(p => p.id === parseInt(req.params.id));
  
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  
  res.json(product);
});

// ==================== USERS ====================

// Get all users (with email filter for login)
app.get('/users', (req, res) => {
  const db = readDB();
  let users = db.users || [];
  
  // Filter by email (for login/register check)
  if (req.query.email) {
    users = users.filter(u => u.email === req.query.email);
  }
  
  res.json(users);
});

// Get single user
app.get('/users/:id', (req, res) => {
  const db = readDB();
  const user = db.users.find(u => u.id === parseInt(req.params.id));
  
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  res.json(user);
});

// Create user (register)
app.post('/users', (req, res) => {
  const db = readDB();
  
  // Check if email already exists
  const existingUser = db.users.find(u => u.email === req.body.email);
  if (existingUser) {
    return res.status(400).json({ error: 'Email already exists' });
  }
  
  const newUser = {
    id: db.users.length > 0 ? Math.max(...db.users.map(u => u.id)) + 1 : 1,
    ...req.body,
    wishlist: req.body.wishlist || [],
    __v: 0
  };
  
  db.users.push(newUser);
  writeDB(db);
  
  res.status(201).json(newUser);
});

// Update user (full update - for wishlist)
app.put('/users/:id', (req, res) => {
  const db = readDB();
  const index = db.users.findIndex(u => u.id === parseInt(req.params.id));
  
  if (index === -1) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  db.users[index] = { ...db.users[index], ...req.body, id: parseInt(req.params.id) };
  writeDB(db);
  
  res.json(db.users[index]);
});

// Patch user (partial update - for address)
app.patch('/users/:id', (req, res) => {
  const db = readDB();
  const index = db.users.findIndex(u => u.id === parseInt(req.params.id));
  
  if (index === -1) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  db.users[index] = { ...db.users[index], ...req.body };
  writeDB(db);
  
  res.json(db.users[index]);
});

// ==================== CATEGORIES ====================

// Get all categories
app.get('/categories', (req, res) => {
  const db = readDB();
  res.json(db.categories || []);
});

// ==================== ORDERS ====================

// Get all orders (with userId filter)
app.get('/orders', (req, res) => {
  const db = readDB();
  let orders = db.orders || [];
  
  if (req.query.userId) {
    orders = orders.filter(o => o.userId === parseInt(req.query.userId));
  }

  const sortBy = req.query._sort;
  const order = req.query._order || 'asc';

  if (sortBy) {
    orders.sort((a, b) => {
      const valA = a[sortBy];
      const valB = b[sortBy];

      let comparison = 0;
      if (valA > valB) {
        comparison = 1;
      } else if (valA < valB) {
        comparison = -1;
      }
      return order === 'desc' ? comparison * -1 : comparison;
    });
  }
  
  res.json(orders);
});

// Get single order
app.get('/orders/:id', (req, res) => {
  const db = readDB();
  const order = db.orders.find(o => o.id === parseInt(req.params.id));
  
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }
  
  res.json(order);
});

// Create order
app.post('/orders', (req, res) => {
  const db = readDB();
  const newOrder = {
    id: db.orders.length > 0 ? Math.max(...db.orders.map(o => o.id)) + 1 : 1,
    ...req.body,
    createdAt: req.body.createdAt || new Date().toISOString()
  };
  
  db.orders.push(newOrder);
  writeDB(db);
  
  res.status(201).json(newOrder);
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 API Server running on port ${PORT}`);
  console.log(`📦 Database file: ${DB_FILE}`);
});
