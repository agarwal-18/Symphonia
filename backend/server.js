import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import projectRoutes from './routes/projects.js';
import commentRoutes from './routes/comments.js';
import uploadRoutes from './routes/upload.js';
import aiRoutes from './routes/ai.js';
import verificationRoutes from './routes/verification.js';
import { initializeSocket } from './utils/socket.js';

dotenv.config();

// Validate required environment variables
if (!process.env.JWT_SECRET) {
  console.warn('⚠️  WARNING: JWT_SECRET is not set. Authentication will not work properly.');
  console.warn('   Please set JWT_SECRET in your .env file.');
}

// Check email configuration
const hasSmtp = process.env.SMTP_HOST && process.env.SMTP_PORT && process.env.SMTP_USER && process.env.SMTP_PASSWORD;
const hasGmail = process.env.EMAIL_USER && process.env.EMAIL_PASSWORD;
if (!hasSmtp && !hasGmail) {
  console.warn('⚠️  WARNING: Email not configured. Email verification will not work.');
  console.warn('   Please set EMAIL_USER/EMAIL_PASSWORD for Gmail or SMTP_* variables for custom SMTP.');
  console.warn('   See EMAIL_SETUP.md for configuration instructions.');
}

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/verification', verificationRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Symphonia API is running' });
});

// Initialize Socket.io
initializeSocket(io);

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/symphonia';

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    console.log(`📍 Database: ${MONGODB_URI.replace(/\/\/.*@/, '//***@')}`);
  })
  .catch((error) => {
    console.error('❌ MongoDB connection error:', error.message);
    console.error('\n📝 To fix this error:');
    console.error('   1. Install MongoDB locally: https://www.mongodb.com/try/download/community');
    console.error('   2. OR use MongoDB Atlas: https://www.mongodb.com/cloud/atlas');
    console.error('   3. Update MONGODB_URI in your .env file');
    console.error('\n💡 For MongoDB Atlas, your connection string will look like:');
    console.error('   mongodb+srv://username:password@cluster.mongodb.net/symphonia?retryWrites=true&w=majority\n');
    process.exit(1);
  });

// Start server after MongoDB connection
mongoose.connection.on('connected', () => {
  const PORT = process.env.PORT || 5000;
  
  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`🌐 API URL: http://localhost:${PORT}`);
    console.log(`📡 Socket.io ready for real-time connections`);
    console.log(`\n✅ Backend is ready! Frontend can now connect.\n`);
  });

  // Handle server errors
  httpServer.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
      console.error(`❌ Port ${PORT} is already in use!`);
      console.error(`   Either stop the other application or change PORT in .env`);
      process.exit(1);
    } else {
      console.error('❌ Server error:', error);
      process.exit(1);
    }
  });
});

export default app;
