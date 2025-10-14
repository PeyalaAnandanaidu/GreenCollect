// server.js
require('dotenv').config();
const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const { Server } = require('socket.io');
const companyRoutes = require('./routes/companyRoutes');

const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: ['http://localhost:5173', 'http://localhost:3000'],
    methods: ['GET', 'POST']
  }
});

app.use(express.json());
app.use(
  cors({
    origin: ['http://localhost:5173', 'http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  })
);

// Connect to MongoDB
const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/janathagarage';
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('✅ MongoDB connected successfully'))
  .catch(err => {
    console.error('❌ MongoDB connection error:', err?.message || err);
    console.warn('Continuing to start server without database connection (dev mode).');
  });

// Import routes
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/product');
const userRoutes = require('./routes/UserRoutes');
const notificationRoutes = require('./routes/notifications');
const adminRoutes = require('./routes/admin');
const wasteRequestRoutes = require('./routes/wasteRequest');

// Import middleware
const { authMiddleware } = require('./middleware/auth');

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/waste-requests', wasteRequestRoutes); // Add waste requests routes
app.use('/api', companyRoutes);

// Protected example route
app.get('/api/protected', authMiddleware, (req, res) => {
  res.json({ 
    success: true,
    message: 'You accessed a protected route', 
    user: req.user 
  });
});

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ 
    success: true,
    status: 'OK', 
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
  });
});

// Root route
app.get('/', (req, res) => {
  res.json({ 
    success: true,
    message: '🚀 Janatha Garage Backend Server is Running!',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      products: '/api/products',
      users: '/api/users',
      admin: '/api/admin',
      notifications: '/api/notifications',
      wasteRequests: '/api/waste-requests',
      health: '/api/health'
    }
  });
});

const PORT = Number(process.env.PORT || 4000);
const server = httpServer.listen(PORT,'0.0.0.0', () => {
  console.log(`🎯 Server running on port ${PORT}`);
  console.log(`🔗 http://localhost:${PORT}`);
  console.log(`🏥 Health check: http://localhost:${PORT}/api/health`);
});

server.on('error', (err) => {
  if (err && err.code === 'EADDRINUSE') {
    const alt = PORT + 1;
    console.warn(`Port ${PORT} in use. Retrying on ${alt}...`);
    httpServer.listen(alt, () => {
      console.log(`Server running on port ${alt}`);
    });
  } else {
    console.error('Server error:', err);
  }
});

// Socket authentication
io.on('connection', (socket) => {
  const userId = socket.handshake.query.userId;
  if (userId) {
    socket.join(`user:${userId}`);
    console.log(`User ${userId} connected to socket`);
  }
});

// MongoDB change stream for real-time notifications
const Notification = require('./models/Notification');
mongoose.connection.once('open', () => {
  try {
    const changeStream = Notification.watch([], { fullDocument: 'updateLookup' });
    changeStream.on('change', (change) => {
      if (change.operationType === 'insert') {
        const doc = change.fullDocument;
        const room = `user:${doc.userId?.toString?.() || doc.userId}`;
        io.to(room).emit('notification:new', {
          _id: doc._id,
          message: doc.message,
          type: doc.type,
          read: doc.read,
          createdAt: doc.createdAt,
          meta: doc.meta,
        });
      }
    });
    console.log('✅ MongoDB change stream activated for real-time notifications');
  } catch (err) {
    console.warn('❌ Change stream unavailable (likely standalone MongoDB):', err?.message || err);
  }
});
