import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const initializeSocket = (io) => {
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error('Authentication error'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId).select('-password');
      
      if (!user) {
        return next(new Error('User not found'));
      }

      socket.userId = user._id.toString();
      socket.username = user.username;
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`✅ User connected: ${socket.username} (${socket.userId})`);

    // Join project room
    socket.on('join-project', (projectId) => {
      socket.join(`project:${projectId}`);
      io.to(`project:${projectId}`).emit('user-joined', {
        userId: socket.userId,
        username: socket.username
      });
    });

    // Leave project room
    socket.on('leave-project', (projectId) => {
      socket.leave(`project:${projectId}`);
      io.to(`project:${projectId}`).emit('user-left', {
        userId: socket.userId,
        username: socket.username
      });
    });

    // Real-time comment creation
    socket.on('comment-added', (data) => {
      socket.to(`project:${data.projectId}`).emit('new-comment', {
        ...data,
        userId: socket.userId,
        username: socket.username
      });
    });

    // Real-time comment update
    socket.on('comment-updated', (data) => {
      socket.to(`project:${data.projectId}`).emit('comment-update', data);
    });

    // Real-time playback sync (optional)
    socket.on('playback-sync', (data) => {
      socket.to(`project:${data.projectId}`).emit('playback-update', {
        ...data,
        userId: socket.userId
      });
    });

    // Typing indicator for comments
    socket.on('typing-comment', (data) => {
      socket.to(`project:${data.projectId}`).emit('user-typing-comment', {
        userId: socket.userId,
        username: socket.username,
        timestamp: data.timestamp
      });
    });

    socket.on('disconnect', () => {
      console.log(`❌ User disconnected: ${socket.username}`);
    });
  });
};
