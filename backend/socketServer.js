import { Server } from 'socket.io';
import Message from './models/Message.js';
import Conversation from './models/Conversation.js';

let io;

export const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*", // Allow all origins for testing
      methods: ["GET", "POST"],
      credentials: true
    },
    transports: ['websocket', 'polling']
  });

  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Join conversation room
    socket.on('joinConversation', (conversationId) => {
      socket.join(conversationId);
      console.log(`User ${socket.id} joined conversation ${conversationId}`);
    });

    // Leave conversation room
    socket.on('leaveConversation', (conversationId) => {
      socket.leave(conversationId);
      console.log(`User ${socket.id} left conversation ${conversationId}`);
    });

    // Handle new message
    socket.on('sendMessage', async (data) => {
      try {
        const { conversationId, message, sender, senderType } = data;

        // Create new message
        const newMessage = new Message({
          conversationId,
          text: message,
          sender: senderType // 'user' or 'clerk'
        });

        await newMessage.save();

        // Update conversation's last message and timestamp
        await Conversation.findByIdAndUpdate(conversationId, {
          lastMessage: message,
          updatedAt: new Date(),
          ...(senderType === 'user' && { unreadCount: await Message.countDocuments({ conversationId, sender: 'user', createdAt: { $gt: new Date(Date.now() - 24 * 60 * 60 * 1000) } }) })
        });

        // Emit to all users in the conversation room EXCEPT the sender
        socket.to(conversationId).emit('newMessage', {
          _id: newMessage._id,
          text: newMessage.text,
          sender: newMessage.sender,
          createdAt: newMessage.createdAt,
          conversationId: conversationId
        });

        // Also emit to clerk room for real-time updates
        io.emit('conversationUpdated', { conversationId });

      } catch (error) {
        console.error('Error sending message via socket:', error);
        socket.emit('messageError', { error: 'Failed to send message' });
      }
    });

    // Handle conversation updates
    socket.on('updateConversation', (conversationId) => {
      io.emit('conversationUpdated', { conversationId });
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized');
  }
  return io;
};

export default initializeSocket;