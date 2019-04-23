const currentRooms = document.getElementById('current-rooms');
const messages = document.getElementById('messages');

const socket = io('http://localhost:3000/', {});
socket.on('clientConnected', data => {
  const clients = document.getElementById('clients');
  clients.innerHTML = data.clientsLength;
});

socket.on('currentRoom', data => {
  console.log(data);

  currentRooms.innerHTML = data.currentRoom;
});

socket.on('clientJoinned', data => {
  const room = document.getElementById(data.room);
  room.innerHTML = data.roomLength;
});

socket.on('receiveMessage', () => {
  addMessage();
});

const bt1 = document.getElementById('bt1');
const bt2 = document.getElementById('bt2');
const bt3 = document.getElementById('bt3');
const btleave = document.getElementById('btleave');
const btsend = document.getElementById('btsend');
const btclean = document.getElementById('btclean');

bt1.addEventListener('click', () => {
  socket.emit('joinRoom', { room: 1 });
});

bt2.addEventListener('click', () => {
  socket.emit('joinRoom', { room: 2 });
});

bt3.addEventListener('click', () => {
  socket.emit('joinRoom', { room: 3 });
});

btleave.addEventListener('click', () => {
  socket.emit('leaveRoom');
});

btclean.addEventListener('click', () => {
  messages.innerHTML = '';
});

const getNumber = number => {
  return number < 10 ? `0${number}` : number;
};

const getCurrenDate = () => {
  const now = new Date();
  return `${getNumber(now.getHours())}:${getNumber(now.getMinutes())}`;
};

const addMessage = () => {
  var li = document.createElement('li');
  const date = getCurrenDate();
  li.appendChild(document.createTextNode(`${date}: New message`));
  messages.appendChild(li);
};

btsend.addEventListener('click', () => {
  socket.emit('sendMessage');
  addMessage();
});
