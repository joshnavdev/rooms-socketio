const socketIO = require('socket.io');
const socketHelper = require('./socketHelper');
const PORT = process.env.PORT || 3000;
const io = socketIO.listen(PORT)


const allClients = [];
io.on('connection', function(socket) {
  console.log('client connected', socket.id);

  allClients.push(socket);
  io.emit('clientConnected', { clientsLength: allClients.length });

  const rooms = ['room1', 'room2', 'room3'];
  rooms.forEach(room => {
    const roomLength = socketHelper.getRoomLength(io, room);
    socket.emit('clientJoinned', { roomLength, room });
  });

  socket.on('disconnect', () => {
    console.log('client disconnected', socket.id);

    const idx = allClients.indexOf(socket);
    allClients.splice(idx, 1);
    io.emit('clientConnected', { clientsLength: allClients.length });

    const rooms = ['room1', 'room2', 'room3'];
    rooms.forEach(room => {
      const roomLength = socketHelper.getRoomLength(io, room);
      socket.broadcast.emit('clientJoinned', { roomLength, room });
    });
  });

  socket.on('joinRoom', data => {
    const currentRoom = socketHelper.getRoomBySocket(io, socket.id);
    const room = `room${data.room}`;
    if (currentRoom === room) {
      return;
    }

    if (currentRoom) {
      socket.leave(currentRoom);
      const currentRoomLength = socketHelper.getRoomLength(io, currentRoom);
      io.emit('clientJoinned', {
        roomLength: currentRoomLength,
        room: currentRoom
      });
    }

    socket.join(room);
    socket.emit('currentRoom', { currentRoom: room });

    const roomLength = socketHelper.getRoomLength(io, room);
    io.emit('clientJoinned', { roomLength, room });
  });

  socket.on('leaveRoom', () => {
    const currentRoom = socketHelper.getRoomBySocket(io, socket.id);

    if (!currentRoom) {
      return;
    }

    socket.leave(currentRoom);
    socket.emit('currentRoom', { currentRoom: 'no room' });
    const roomLength = socketHelper.getRoomLength(io, currentRoom);
    io.emit('clientJoinned', { roomLength, room: currentRoom });
  });

  socket.on('sendMessage', () => {
    const currentRoom = socketHelper.getRoomBySocket(io, socket.id);

    if (currentRoom) socket.broadcast.to(currentRoom).emit('receiveMessage');
  });
});
