// server.js
require('dotenv').config();
const cors=require('cors');
const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const { Server } = require('socket.io');
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/product');
const userRoutes = require('./routes/UserRoutes');
const notificationRoutes = require('./routes/notifications');
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
      origin: ['http://localhost:5173', 'http://localhost:3000'], // your frontend URLs
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      credentials: true, // allow cookies or tokens if needed
    })
  );

// Connect to MongoDB
const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/myapp';
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => {
    console.error('MongoDB connection error:', err?.message || err);
    console.warn('Continuing to start server without database connection (dev mode).');
  });

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/notifications', notificationRoutes);
// Protected example route
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'secret';
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload; // { id, role, iat, exp }
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

app.get('/api/protected', authMiddleware, (req, res) => {
  res.json({ message: 'You accessed a protected route', user: req.user });
});

const PORT = Number(process.env.PORT || 4000);
const server = httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
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

// Socket authentication (demo: userId via query)
io.on('connection', (socket) => {
  const userId = socket.handshake.query.userId;
  if (userId) {
    socket.join(`user:${userId}`);
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
  } catch (err) {
    console.warn('Change stream unavailable (likely standalone MongoDB):', err?.message || err);
  }
});
