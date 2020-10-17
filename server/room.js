const wordlist = require('../lang/english.js');
const Player = require('./player.js');


//TODO: 
//handle game state if active  player disconnects
//send current drawing to new player
//ensure words chosen are unique
//

//check if value is between bounds (inclusive)
function inBounds(x, lowBound, highBound) {
	return x >= lowBound && x <= highBound;
}

const STATE = {
	LOBBY: 0,
	CHOICE: 1,
	DRAW: 2,
	END: 3,
}

class Room{
	constructor(id,io){
		this.id = id;
		this.io = io;
		//game loop: lobby -> choice -> draw -> end
		this.players = [];
		this.playerCount = 0;
		this.resetState();
		this.memory = []
	}

	getEndTime(){
		return this.startTime + this.drawTime * 1000;
	}

	getPlayer(id) {
		return this.players.filter(x=>x.id===id).pop()
	}

	resetState(){
		this.state = STATE.LOBBY;
		this.currentPlayer = null;
		this.currentPlayerName = '';
		this.word = "";
		this.maskedWord = "";
		this.lowerCaseWord = "";
		this.choices = ['','',''];
		this.round = 0;
		this.image = "";
		this.startTime = Date.now();
		this.drawTime = 80;
		this.memory = []
		clearTimeout(this.timer);
		this.timer = null;

		for(let player of this.players){
			player.participated = false;
		}
	}

	updateStatus(){
		if(this.state !== STATE.LOBBY && this.playerCount < 2){
			//stop game
			this.resetState();
		}else if(this.state === STATE.LOBBY && this.playerCount > 1){
			//start game
			console.log("starting");
			this.timer = setTimeout(()=>{this.newRound()}, 300);
		}
	}

	newRound(){
		this.round += 1;
		console.log("Round: ", this.round);
		for(let player of this.players){
			player.participated = false;
		}
		this.io.to(this.id).emit("round", this.round);

		this.timer = setTimeout(()=>{this.sendChoices()}, 300);
	}

	
	//on player connect to room
	addPlayer(data, socket){
		if(this.players.length >= 10){
			return -1;
		}

		let properties = Player.validate(data);
		if(properties === false){
			return -1;
		}
		if(properties[0] === '') {
			properties[0] = wordlist.sample();
		}
		let player = new Player(socket.id, ...properties);
		this.players.push(player);
		this.playerCount = this.players.length
		this.updateStatus()

		socket.emit('connected');
		socket.emit('roominfo', {players: this.players.map(x=>x.publicInfo()), round: this.round});
		if(this.state === STATE.CHOICE){
		  socket.emit('choosing', this.currentPlayerName);
		}else if(this.state === STATE.DRAW){
		  socket.emit('secret', {
			  time: this.getEndTime(),
			  word: this.maskedWord,
			  drawing: this.currentPlayer});
		}
		socket.join(this.id);
		socket.to(this.id).emit('playerjoined', player.publicInfo());
		this.io.to(this.id).emit('message', {content: `${properties[0]} joined.`, color: '#56ce27'});

		return this.playerCount - 1
	}

	//on player leave to room
	removePlayer(socket) {
		for(let i=0; i < this.players.length; i++){
			if(this.players[i].id == socket.id){
				let name = this.players[i].name
				this.players.splice(i,1);
				this.playerCount = this.players.length;
				this.updateStatus()

				socket.to(this.id).emit('playerleft', socket.id);
				socket.to(this.id).emit('message', {content: `${name} left.`, color: '#ce4f0a'});
				return i;
			}
		}
		return -1;
	}

	//game timer
	start(){
		console.log("triggered: start()");
		this.startTime = Date.now();
		this.state = STATE.DRAW;
		let secret = {
			time: this.getEndTime(),
			word: this.maskedWord,
			drawing: this.currentPlayer
		}
		for(let x of this.players){
			if(x.id!=this.currentPlayer){
				this.io.to(this.id).emit('secret', secret);
			}
		}
		secret.word = this.word;
		this.io.to(this.currentPlayer).emit('secret', secret);
		this.io.to(this.id).emit('message', {
			content: `${this.currentPlayerName} is now drawing!`,
			color: '#3975ce'
		});
		//count down 60 seconds
		this.timer = setTimeout(()=>{this.end("Time is up!")}, this.drawTime * 1000);
	}

	end(reason){
		console.log("triggered: end()");
		console.log(reason, Date.now()-this.startTime)
		clearTimeout(this.timer)
		this.timer = null;

		//display end screen;
		//return to choice
		this.state = STATE.END;
		//send results in descending order
		let deltas = this.players.filter(x=>x.id!=this.currentPlayer);
		deltas = deltas.map(x=>{
			return {
				name: x.name,
				change: x.scoreDelta
			}
		});
		let drawer = this.currentPlayerName;
		//calculate drawer score = sum(changes) / correct guesses + 1
		let drawerScore = Math.floor(deltas.reduce((x,y)=>x+y.change, 0) / (deltas.length + 1));  
		deltas.push({name: drawer, change: drawerScore});
		deltas.sort((x,y)=>y.change-x.change)
		
		this.io.to(this.id).emit('end', {
			reason: reason,
			scores: deltas,
			word: this.word
		});
		//wait 5 seconds and then continue game loop
		setTimeout(()=>{this.sendChoices()}, 5000);

		for(let player of this.players){
			player.scoreDelta = 0;
		}
	}

	draw(data, socket) {
		if(
			socket.id !== this.currentPlayer ||
			!Array.isArray(data) ||
			data.length != 6 ||
			!data.every(Number.isInteger) ||
			!inBounds(data[0], 0, 800) ||
			!inBounds(data[1], 0, 600) ||
			!inBounds(data[2], 0, 800) ||
			!inBounds(data[3], 0, 600) ||
			!inBounds(data[4], 0, 22) ||
			!inBounds(data[5], 0, 4) 
		) {
			console.log(data)
			return -1
		}
		this.memory.push(data);
		socket.to(this.id).emit('draw', data);
	}

	fill(data, socket) {
		if(
			socket.id !== this.currentPlayer ||
			!Array.isArray(data) ||
			data.length != 3 ||
			!data.every(Number.isInteger) ||
			!inBounds(data[0], 0, 800) || 
			!inBounds(data[1], 0, 600) ||
			!inBounds(data[2], 0, 22)
		) {
		  return -1;
		}
		this.memory.push(data);
		socket.to(this.id).emit('fill',data);
	}

	clear(socket) {
		if(socket.id !== this.currentPlayer) {
		  return -1;
		}
		this.memory = [];
		socket.to(this.id).emit('clear');
	}

	sendChoices(){
		console.log("triggered: sendChoices()");
		if(this.playerCount < 2){
			//prevent game from playing when no one is on
			return
		}
		//select player first
		let player = null;
		for(let p of this.players){
			if(!p.participated){
				p.participated = true;
				player = p;
				break
			}
		}
		if(player == null) {
			console.log("All players have particpated, starting new round");
			this.newRound();
		}else {
			this.state = STATE.CHOICE;
			//select three words
			for(let i = 0; i < 3; i++) {
				this.choices[i] = wordlist.sample();
			}

			this.currentPlayer = player.id;
			this.currentPlayerName = player.name;
			
			for(let p of this.players) {
				if(p.id != player.id) {
					this.io.to(p.id).emit('choosing', player.name);
					console.log(p.id)
				}
			}
			this.io.to(player.id).emit('choice', this.choices);
		}
	}

	selectChoice(choice, socket) {
		if(!Number.isInteger(choice) || !inBounds(choice, 0, 2)) {
		  return -1;
		}

		let player = this.getPlayer(socket.id);
		if(this.state !== STATE.CHOICE || socket.id !== this.currentPlayer) {
		  return -1;
		}

		this.word = this.choices[choice];
		this.maskedWord = this.word.replace(/\S/g, '_');
		this.lowerCaseWord = this.word.toLowerCase();
		this.choices = ['','',''];
		this.start();
	}

	message(data, socket) {
		if(typeof(data) !== 'string' || data.length > 100) {
			return -1;
		}
		let player = this.getPlayer(socket.id);

		if(this.state === STATE.DRAW) {
			//if player is the drawer or has guessed correctly 
			if(player.id === this.currentPlayer || player.scoreDelta) {
				const message = {
					name: player.name,
					content: data,
					color: '#7dad3f'
				};
				for(p of this.players.filter(x=>x.scoreDelta)) {
					io.to(p.id).emit('message', message);
				}
				//emit to drawer
				socket.emit('message', message);
				return 0;
			}

			if(data.trim().toLowerCase() === this.lowerCaseWord) {
				//Player guessed the right word!
				player.scoreDelta = Math.floor(this.drawTime - (Date.now() - this.startTime) / 1000);
				player.score += player.scoreDelta;

				this.io.to(this.id).emit('message', {
					content: `${player.name} guessed the word!`,
					color: '#56ce27'
				});

				this.io.to(this.is).emit('update', {
					id: player.id,
					score: player.score
				});

				//check all players have scored
				if(this.players.filter(x=>x.scoreDelta).length == this.playerCount - 1) {
					this.end('Everybody guessed the word!');
				}
				return 0;
			} 
		}
			//emit generic chat message
		this.io.to(this.id).emit('message', {name: player.name, content: data});
	}
}

module.exports = Room;
