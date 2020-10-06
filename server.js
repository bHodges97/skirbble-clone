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

function random_item(items){
	return items[Math.floor(Math.random()*items.length)];
}

class Room{
	constructor(id){
		this.id = id;
		this.gameState = "lobby";
		this.players = new Array(10);
		this.currentPlayer = null;
		this.word = "";
		this.hiddenWord = "";
		this.compareWord = "";
		this.choices = ['','',''];
		this.round = 0;
		this.image = "";
		this.playerCount = 0
		this.startTime = Date.now()
	}

	updateStatus(){
		if(this.gameState != "lobby" && this.playerCount == 1){
			//stop game


		}else if(this.gameState == "lobby" && this.playerCount > 1){
			//start game
			this.newRound();
		}
	}

	newRound(){
		this.round += 1;
		for(let player of this.players){
			player.participated = false;
		}
		io.to(this.id).emit("round", this.round);
		this.selectWord();
	}

	selectWord(){
		//select player first
		let player = null;
		for(let p of this.players){
			if(p.participated){
				player = p
				p.participated = true;
				break
			}
		}
		if(player == null){
			newRound();
		}else{
			//select three words
			for(let i = 0; i < 3; i++){
				this.choices[i] = random_item(wordlist);
			}

			this.currentPlayer = player;

			io.to(this.id).emit('choosing', player.name);
			io.to(player.id).emit('choice', this.choices);
		}
	}

	addPlayer(data, id){
		for(let i=0;i < this.players.length; i++){
			if(this.players[i] === undefined){
				this.players[i] = data;
				this.players[i].score = 0;
				this.players[i].key = id;
				this.players[i].participated = false;
				this.playerCount+=1
				this.updateStatus()
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
				this.updateStatus()
				return name;
			}
		}
	}

	//game timer
	start(){
		this.startTime = Date.now()
		io.to(this.id).emit('go', {time: this.startTime, word: this.hiddenWord});
		setTimeout(myFunc, 1500, 'funky');
	}

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

	//player connecting
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
	
	//playing sends message in chat
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

	//player chooses a word;
	socket.on('choice', (data)=>{
		if(!Number.isInteger(data) || data < 0  || data > 2 || clientrooms.length == 1){
			socket.emit('error')
			return
		}
		console.log(clientrooms);
		let roomcode = clientrooms[1]
		let room = rooms.get(roomcode);
		let player = room.getPlayer(socket.id);
		if (socket.id == room.currentPlayer){
			room.word = room.choices[data];
			room.hiddenWord = ''
			for(let c of room.word){
				room.hiddenWord += c==' '?' ':'_';
			}
			room.compareWord = room.displayerWord.toLowerCase();
			room.choices = ['','',''];
			room.start();
		}
	});
	
	//player disconnects
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


