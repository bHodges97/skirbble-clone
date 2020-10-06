const app = require('express')()
const server = require('http').Server(app)
const next = require('next')
const socketio = require('socket.io')

const io = socketio(server);
const dev = process.env.NODE_ENV !== 'production'
const nextApp = next({ dev })
const nextHandle = nextApp.getRequestHandler()
const Room = require('./room.js');
const wordlist = require('./words.js');

Array.prototype.sample = function(){
  return this[Math.floor(Math.random()*this.length)];
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
room1 = new Room("room1",io);
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
			data.name = wordlist.sample();
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
		let roomcode = clientrooms[1]
		let room = rooms.get(roomcode);
		let player = room.getPlayer(socket.id);
		if(clientrooms.length == 2){
			if(room.state == 'draw' && data.trim().toLowerCase() == room.word){
				player.change = Math.floor(room.drawTime - (Date.now() - room.startTime) / 1000);
				player.score += player.change
				io.to(roomcode).emit('message', {content: player.name + ' guessed the word!', color: '#56ce27'});
				io.to(roomcode).emit('update', {id: player.id, score:player.score});
				socket.join(roomcode+"_");
				console.log(player.change)
				if(room.players.filter((x)=>x.score>0).length == room.playerCount - 1){
					console.log("all done")
					clearTimeout(room.timeout);
					room.end('all correct');
				}
			}else{
				io.to(roomcode).emit('message', {name: player.name, content: data});
			}
		}else if(clientrooms.length == 3){
			io.to(clientrooms[2]).emit('message', {name: player.name, content: data, color: '#7dad3f'});
		}
	})

	//player chooses a word;
	socket.on('choice', (data)=>{
		const clientrooms = Object.keys(socket.rooms);
		if(!Number.isInteger(data) || data < 0  || data > 2 || clientrooms.length == 1){
			socket.emit('error');
			return
		}
		let roomcode = clientrooms[1]
		let room = rooms.get(roomcode);
		let player = room.getPlayer(socket.id);
		if(room.state != "choice" || socket.id != room.currentPlayer){
			socket.emit('');
			return;
		}
		room.word = room.choices[data];
		room.hiddenWord = ''
		for(let c of room.word){
			room.hiddenWord += c==' '?' ':'_';
		}
		room.compareWord = room.word.toLowerCase();
		room.choices = ['','',''];
		room.start();
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


