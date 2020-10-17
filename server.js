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

  //TODO: rewrite
  socket.on('tool', (data)=>{
	//format: array: [tool,color,width]
	//tools: pen 0 rubber 1 fill 2
	//color: 0 - 22
	//width: 0 - 4
	const clientrooms = Object.keys(socket.rooms);
	if(clientrooms.length != 2 || !Array.isArray(data) || data.length != 3 || !data.every(Number.isInteger)){
	  console.log('error',clientrooms.length!=2 ,Array.isArray(data), data.length != 3, !data.every(Number.isInteger));
	  return
	}
	let roomcode = clientrooms[1];
	let room = rooms.get(roomcode);
	if(socket.id==room.currentPlayer && data[0] >= 0 && data[0] <= 3 && data[1] >= 0 && data[1] <= 22 && data[2]>=0 &&  data[2] <= 4){
	  room.tool(data);
	  socket.to(roomcode).emit('tool',data);
	}
  });

  //special case for clear, data is last used tool
  socket.on('clear', (data)=>{
	const clientrooms = Object.keys(socket.rooms);
	if(clientrooms.length == 2){
	  rooms.get(clientrooms[1]).clear(data, socket);
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
