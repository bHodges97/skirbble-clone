const app = require('express')()
const server = require('http').Server(app)
const next = require('next')
const socketio = require('socket.io')

const io = socketio(server);
const dev = process.env.NODE_ENV !== 'production'
const nextApp = next({ dev })
const nextHandle = nextApp.getRequestHandler()
const Room = require('./server/room.js');
const wordlist = require('./lang/english.js');

Array.prototype.sample = function(){
  return this[Math.floor(Math.random()*this.length)];
}

rooms = new Map()
room1 = new Room("room1",io);
rooms.set("room1", room1);

io.on('connect', socket => {
  //player connecting
  socket.on('join', (data)=>{
	let roomcode = "room1";
	let room = rooms.get(roomcode);
	//block player joining twice
	if (room.players.some(e => e.id === socket.id)) {
	  return;
	}
	room.addPlayer(data, socket);
  })

  //playing sends message in chat
  socket.on('message', (data)=>{
	const clientrooms = Object.keys(socket.rooms);
	if(clientrooms.length == 2) {
	  rooms.get(clientrooms[1]).message(data, socket);
	}
  });

  socket.on('fill', (data)=>{
	const clientrooms = Object.keys(socket.rooms);
	if(clientrooms.length == 2) {
	  rooms.get(clientrooms[1]).fill(data, socket);
	}
  });

  //special case for clear, data is last used tool
  socket.on('clear', (data)=>{
	const clientrooms = Object.keys(socket.rooms);
	if(clientrooms.length == 2){
	  rooms.get(clientrooms[1]).clear(socket);
	}
  });

  socket.on('draw', (data)=>{
	const clientrooms = Object.keys(socket.rooms);
	if(clientrooms.length == 2) {
	  rooms.get(clientrooms[1]).draw(data, socket);
	}
  });

  //player chooses a word;
  socket.on('choice', (data)=>{
	const clientrooms = Object.keys(socket.rooms);
	if(clientrooms.length == 2) {
	  rooms.get(clientrooms[1]).selectChoice(data, socket);
	}
  });

  //player disconnects
  socket.on('disconnecting', () => {
	const clientrooms = Object.keys(socket.rooms);
	if(clientrooms.length == 2) {
	  rooms.get(clientrooms[1]).removePlayer(socket);
	}
  });
});

nextApp.prepare().then(() => {
  app.get('*',(req,res)=>{
	return nextHandle(req,res)
  })

  server.listen(3000, (err) => {
	if (err) throw err
	console.log('> Ready on http://localhost:3000')
  })
})
