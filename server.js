const app = require('express')()
const server = require('http').Server(app)
const next = require('next')
const socketio = require('socket.io')

const io = socketio(server);
const dev = process.env.NODE_ENV !== 'production'
const nextApp = next({ dev })
const nextHandle = nextApp.getRequestHandler()
const fs = require('fs');

let wordfile = fs.readFileSync('words.json');
const wordlist = JSON.parse(wordfile).words;

class Room{
	constructor(id){
		this.id = id;
		this.players = new Array(10);
		this.word = "";
		this.round = 1;
		this.image = "";
		this.playerCount = 0
	}

	addPlayer(data, id){
		for(let i=0;i < this.players.length; i++){
			if(this.players[i] === undefined){
				this.players[i] = data;
				this.players[i].score = 0;
				this.players[i].key = id;
				this.playerCount+=1
				return i
			}
		}
	}

	removePlayer(id){
		for(let i=0; i < this.players.length; i++){
			if(this.players[i] !== undefined && this.players[i].key == id){
				this.players[i] = undefined;
				this.playerCount-=1
				return i;
			}
		}
	}
}
function random_item(items){
	return items[Math.floor(Math.random()*items.length)];
}

rooms = new Map()

room1 = new Room();
rooms.set("room1", room1);

io.on('connect', socket => {
	socket.emit('now',{
		message: 'message received',
	})
	socket.on('join', (data)=>{
		if(data.name == ""){
			data.name = random_item(wordlist);
		}
		let roomcode = "room1";
		let room = rooms.get(roomcode);
		let id = room.addPlayer(data, socket.id)
		socket.emit('connected');
		socket.emit('players', room.players, id);
		socket.to(roomcode).emit('playerjoined',data);
		socket.join(roomcode);
	})

	socket.on('disconnecting', () => {
		const clientrooms = Object.keys(socket.rooms);
		if(clientrooms.length == 2){
			rooms.get(clientrooms[1]).removePlayer(clientrooms[0])
		}
		// the rooms array contains at least the socket ID
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


