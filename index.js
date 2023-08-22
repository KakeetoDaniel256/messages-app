const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// In-memory storage for messages
const messages = [];

app.use(express.static(__dirname + '/public'));

io.on('connection', (socket) => {
  console.log('A user connected');

  // Handle new messages
  socket.on('newMessage', (data) => {
    messages.push(data);
    io.emit('message', data, messages.length - 1);
  });

  // Handle message deletion
  socket.on('deleteMessage', (index) => {
    if (index >= 0 && index < messages.length) {
      messages.splice(index, 1);
      io.emit('messageDeleted', index);
      console.log(`Message at index ${index} deleted.`);
    }
  });

  // Send initial messages to the connected client
  socket.emit('initialMessages', messages);

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
