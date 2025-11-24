const Message = require('../models/Message');

module.exports = (io) => {
  // Store connected users
  const users = new Map();

  io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    // User joins
    socket.on('join', (userId) => {
      users.set(userId, socket.id);
      socket.userId = userId;
      console.log(`User ${userId} joined`);
    });

    // Send message
    socket.on('sendMessage', async (data) => {
      try {
        const { sender, recipient, content } = data;

        // Save message to database
        const message = await Message.create({
          sender,
          recipient,
          content
        });

        const populatedMessage = await Message.findById(message._id)
          .populate('sender', 'name avatar')
          .populate('recipient', 'name avatar');

        // Emit to recipient if online
        const recipientSocketId = users.get(recipient);
        if (recipientSocketId) {
          io.to(recipientSocketId).emit('newMessage', populatedMessage);
        }

        // Emit back to sender
        socket.emit('messageSent', populatedMessage);
      } catch (error) {
        socket.emit('error', { message: error.message });
      }
    });

    // Typing indicator
    socket.on('typing', (data) => {
      const recipientSocketId = users.get(data.recipient);
      if (recipientSocketId) {
        io.to(recipientSocketId).emit('userTyping', {
          userId: data.sender,
          isTyping: data.isTyping
        });
      }
    });

    // Disconnect
    socket.on('disconnect', () => {
      if (socket.userId) {
        users.delete(socket.userId);
        console.log(`User ${socket.userId} disconnected`);
      }
    });
  });
};