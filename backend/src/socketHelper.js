const _ = require('lodash');

function getRooms(io) {
  const roomsKeys = Object.keys(io.sockets.adapter.rooms || {});
  const rooms = _.filter(roomsKeys, roomKey => _.includes(roomKey, 'room'));
  return rooms;
}

function getRoomBySocket(io, socketId) {
  const socketRooms = Object.keys(io.sockets.adapter.sids[socketId] || {});
  socketRooms.splice(0, 1);
  return socketRooms[0];
}

function getRoomLength(io, room) {
  if (!io.sockets.adapter.rooms[room]) {
    return 0;
  }

  return io.sockets.adapter.rooms[room].length;
}

module.exports = {
  getRoomBySocket,
  getRoomLength,
  getRooms
};
