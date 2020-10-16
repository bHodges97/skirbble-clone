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
	if(typeof(data) !== 'string' || data.length > 100 || clientrooms.length == 1){
	  socket.emit('error')
	  return
	}
	let roomcode = clientrooms[1]
	let room = rooms.get(roomcode);
	let player = room.getPlayer(socket.id);

	//if player is the drawer or has guessed correctly
	if(room.state == 'draw' && (player.id == room.currentPlayer || player.scoreDelta > 0)){
	  let message = {name: player.name, content: data, color: '#7dad3f'};
	  for(p of room.players.filter(x=>x.scoreDelta>0)){
		io.to(p.id).emit('message', message);
	  }
	}else if(room.state == 'draw' && data.trim().toLowerCase() == room.word){
	  //Player guessed the right word!
	  player.scoreDelta = Math.floor(room.drawTime - (Date.now() - room.startTime) / 1000);
	  player.score += player.scoreDelta
	  io.to(roomcode).emit('message', {content: player.name + ' guessed the word!', color: '#56ce27'});
	  io.to(roomcode).emit('update', {id: player.id, score:player.score});
	  if(room.players.filter((x)=>x.scoreDelta>0).length == room.playerCount - 1){
		clearTimeout(room.timer);
		room.end('Everybody guessed the word!');
	  }
	}else{
	  //emit generic chat message
	  io.to(roomcode).emit('message', {name: player.name, content: data});
	}
  });

  socket.on('tool', (data)=>{
	console.log("tool change", data);
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

  socket.on('clear', (data)=>{
	//special case for clear,
	//data is last used tool
	const clientrooms = Object.keys(socket.rooms);
	if(clientrooms.length != 2 || !Array.isArray(data) || data.length != 3 || !data.all(Number.isInteger)){
	  console.log('error');
	  return
	}
	let roomcode = clientrooms[1];
	let room = rooms.get(roomcode);
	if(socket.id==room.currentPlayer && data[0] >= 0 && data[0] <= 3 && data[1] >= 0 && data[1] <= 22 && data[2]>=0 &&  data[2] <= 4){
	  room.tool(clear);
	  socket.to(roomcode).emit('clear',data);
	}
  });

  socket.on('draw', (data)=>{
	const clientrooms = Object.keys(socket.rooms);
	if(clientrooms.length != 2) {
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
	console.log("disconnecting");
	if(clientrooms.length > 1) {
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


