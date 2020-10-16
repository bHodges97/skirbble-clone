const wordlist = require('../lang/english.js');
const Player = require('./player.js');


//TODO: 
//handle game state if active  player disconnects
//send current drawing to new player
//ensure words chosen are unique
//


//check if value is between bounds (inclusive)
function inBounds(x, lowBound, highBound) {
	return x >= lowBound && x x<= highBound;
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

	resetState(){
		this.state = "lobby";
		this.currentPlayer = null;
		this.currentPlayerName = '';
		this.word = "";
		this.hiddenWord = "";
		this.compareWord = "";
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
		if(this.state != "lobby" && this.playerCount < 2){
			this.resetState();
			//stop game
		}else if(this.state == "lobby" && this.playerCount > 1){
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
		if(this.state == 'choice'){
		  socket.emit('choosing', this.currentPlayerName);
		}else if(this.state == 'draw'){
		  socket.emit('secret', {time: this.startTime, word: this.hiddenWord, drawing: this.currentPlayer});
		}
		socket.join(this.id);
		socket.to(this.id).emit('playerjoined', player.publicInfo());
		this.io.to(this.id).emit('message', {content: `${properties[0]} joined.`, color: '#56ce27'});

		return this.playerCount - 1
	}

	getPlayer(id) {
		return this.players.filter(x=>x.id===id).pop()
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
		this.state = "draw";
		let secret = {time: this.startTime, word: this.hiddenWord, drawing: this.currentPlayer}
		for(let x of this.players){
			if(x.id!=this.currentPlayer){
				this.io.to(this.id).emit('secret', secret);
			}
		}
		this.io.to(this.currentPlayer).emit('secret', {time: this.startTime, word: this.word, drawing: this.currentPlayer});
		this.io.to(this.id).emit('message', {content: this.currentPlayerName + " is now drawing!", color: '#3975ce'});
		//count down 60 seconds
		this.timer = setTimeout(()=>{this.end("Time is up!")}, this.drawTime * 1000);
	}

	end(reason){
		console.log("triggered: end()");
		console.log(reason, Date.now()-this.startTime)
		clearTimeout(this.timer)
		//display end screen;
		//return to choice
		this.state = "end";
		//send results in descending order
		let deltas = this.players.filter((x)=>x.id!=this.currentPlayer)
									.map((x)=>{return {name: x.name, change: x.scoreDelta}});
		let drawer = this.currentPlayName;
		//calculate drawer score = sum(changes) / correct guesses + 1
		let drawerscore = Math.floor(deltas.reduce((x,y)=>x+y.scoreDelta,0) / (deltas.length + 1));  
		deltas.push({name: drawer, change: drawerscore});
		deltas.sort((x,y)=>y.scoreDelta-x.scoreDelta)
		

		this.io.to(this.id).emit('end', {reason: reason, scores: deltas ,word: this.word});
		//wait 5 seconds and then continue game loop
		setTimeout(()=>{this.sendChoices()}, 5000);

		for(let p of this.players){
			p.scoreDelta = 0;
		}
	}

	draw(data, socket) {
		if(!Array.isArray(data) || data.length != 2 || data.some(Number.isNaN)){
			return -1
		}
		if(socket.id==this.currentPlayer && inBounds(data[0], 0, 800) && inBounds(data[1], 0, 600)){
			if(this.memory.length) {
				this.memory[this.memory.length-1].push(data[0]);
				this.memory[this.memory.length-1].push(data[1]);
			}
			socket.to(this.id).emit('draw',data);
		}
	}

	tool(data){
		this.memory.push(data);
	}

	clear(data, socket){
		this.memory = [data];
		if(!Array.isArray(data) || data.length != 3 || !data.all(Number.isInteger)){
		  return -1
		}
		if(socket.id == this.currentPlayer && inBounds(data[0], 0 ,3) && inBounds(data[1], 0, 22) && inBounds(data[2], 0, 4)){
		  this.tool(clear);
		  socket.to(roomcode).emit('clear', data);
		}
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
		if(player == null){
			console.log("All players have particpated, starting new round");
			this.newRound();
		}else{
			this.state = "choice";
			//select three words
			for(let i = 0; i < 3; i++){
				this.choices[i] = wordlist.sample();
			}

			this.currentPlayer = player.id;
			this.currentPlayerName = player.name;
			
			for(let p of this.players){
				if(p.id != player.id){
					this.io.to(p.id).emit('choosing', player.name);
					console.log(p.id)
				}
			}
			this.io.to(player.id).emit('choice', this.choices);
		}
	}

	selectChoice(choice, socket) {
		if(!Number.isInteger(choice) || choice < 0  || choice> 2){
		  return -1
		}
		let player = this.getPlayer(socket.id);
		if(this.state != "choice" || socket.id != this.currentPlayer){
		  return -1;
		}
		this.word = this.choices[choice];
		this.hiddenWord = this.word.replace(/\S/g, '_');
		this.compareWord = this.word.toLowerCase();
		this.choices = ['','',''];
		this.start();
	}

	message(data, socket) {
		if(typeof(data) !== 'string' || data.length > 100) {
			return -1;
		}
		let player = this.getPlayer(socket.id);

		//if player is the drawer or has guessed correctly
		if(this.state == 'draw' && (player.id == this.currentPlayer || player.scoreDelta > 0)){
			const message = {name: player.name, content: data, color: '#7dad3f'};
			for(p of this.players.filter(x=>x.scoreDelta>0)){
				io.to(p.id).emit('message', message);
			}
		}else if(this.state == 'draw' && data.trim().toLowerCase() == this.word){
			//Player guessed the right word!
			player.scoreDelta = Math.floor(this.drawTime - (Date.now() - this.startTime) / 1000);
			player.score += player.scoreDelta
			this.io.to(this.id).emit('message', {content: `${player.name} guessed the word!`, color: '#56ce27'});
			this.io.to(this.is).emit('update', {id: player.id, score:player.score});

			//check all players have scored
			if(this.players.filter((x)=>x.scoreDelta>0).length == this.playerCount - 1) {
				clearTimeout(this.timer);
				this.end('Everybody guessed the word!');
			}
		}else{
			//emit generic chat message
			this.io.to(this.id).emit('message', {name: player.name, content: data});
		}
	}
}

module.exports = Room;
