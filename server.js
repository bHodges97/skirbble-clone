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
		this.displayWord = "";
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

	getPlayer(id){
		for(let i=0; i < this.players.length; i++){
			if(this.players[i] !== undefined && this.players[i].key == id){
				return this.players[i];
			}
		}
	}

	removePlayer(id){
		for(let i=0; i < this.players.length; i++){
			if(this.players[i] !== undefined && this.players[i].key == id){
				let name = this.players[i].name
				this.players[i] = undefined;
				this.playerCount-=1
				return name;
			}
		}
	}
}
function random_item(items){
	return items[Math.floor(Math.random()*items.length)];
}

function validate(user){
	if(typeof(user) !== 'object' || !('name' in user) || user.name.length > 32){
		return false	
	}

	let keys = ['hat','face','color'];
	for (const key of keys){
		if(!(key in user) || !Number.isInteger(user[key]) || user[key] < 0 || user[key] > 13){
			return false
		}
	}	
	return {name: user.name, hat: user.hat, face: user.face, color: user.color}
}

rooms = new Map()

room1 = new Room();
rooms.set("room1", room1);

io.on('connect', socket => {
	socket.emit('now',{
		message: 'message received',
	})
	socket.on('join', (data)=>{
		data = validate(data)
		if(data == false){
			socket.emit('error');
			return;
		}
		if(data.name == ""){
			data.name = random_item(wordlist);
		}
		let roomcode = "room1";
		let room = rooms.get(roomcode);
		let id = room.addPlayer(data, socket.id)
		socket.emit('connected');
		socket.emit('players', room.players, id);
		socket.join(roomcode);
		socket.to(roomcode).emit('playerjoined', room.players[id]);
		io.to(roomcode).emit('message', {content: data.name + " joined.", color: '#56ce27'});
	})

	socket.on('message', (data)=>{
		const clientrooms = Object.keys(socket.rooms);
		if(typeof(data) !== 'string' || data.length > 100 || clientrooms.length == 1){
			socket.emit('error')
			return
		}
		console.log(clientrooms);
		let roomcode = clientrooms[1]
		let room = rooms.get(roomcode);
		let player = room.getPlayer(socket.id);
		if(clientrooms.length == 2){
			let guess = data.trim().toLowerCase();

			if(guess == room.word){
				io.to(roomcode).emit('message', {content: player.name + ' guessed the word!', color: '#56ce27'});
				socket.join(roomcode+"_");
			}else{
				io.to(roomcode).emit('message', {name: player.name, content: data});
			}
		}else if(clientrooms.length == 3){
			io.to(clientrooms[2]).emit('message', {name: player.name, content: data, color: '#7dad3f'});
		}
	})

	socket.on('disconnecting', () => {
		const clientrooms = Object.keys(socket.rooms);
		console.log("disconnecting");
		if(clientrooms.length > 1){
			let room = rooms.get(clientrooms[1]);
			let name = room.removePlayer(clientrooms[0]);
			socket.to(clientrooms[1]).emit('playerleft',socket.id);
			socket.to(clientrooms[1]).emit('message', {content: name + " left.", color: '#ce4f0a'});
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


