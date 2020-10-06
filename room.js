const wordlist = require('./words.js');

//TODO: 
//handle game state if activate  player disconnects
//save current drawing
//ensure words chosen are unique
//add stop game when player count is low

class Room{
	constructor(id,io){
		this.id = id;
		this.io = io;
		//game loop: lobby -> choice -> draw -> end
		this.state = "lobby";
		this.players = new Array(10);
		this.currentPlayer = null;
		this.word = "";
		this.hiddenWord = "";
		this.compareWord = "";
		this.choices = ['','',''];
		this.round = 0;
		this.image = "";
		this.playerCount = 0;
		this.startTime = Date.now();
		this.drawTime = 80;
		this.timer = null;
	}

	updateStatus(){
		if(this.state != "lobby" && this.playerCount < 2){
			//stop game
		}else if(this.state == "lobby" && this.playerCount > 1){
			//start game
			console.log("starting");
			this.newRound();
		}
	}

	newRound(){
		this.round += 1;
		for(let player of this.players){
			if(player != undefined){
				player.participated = false;
			}
		}
		this.io.to(this.id).emit("round", this.round);
		this.selectWord();
	}

	selectWord(){
		//select player first
		let player = null;
		for(let p of this.players){
			if(p != undefined && !p.participated){
				player = p
				p.participated = true;
				break
			}
		}
		if(player == null){
			newRound();
		}else{
			console.log("choice for ",player.id);
			this.state = "choice";
			//select three words
			for(let i = 0; i < 3; i++){
				this.choices[i] = wordlist.sample();
			}
			console.log(this.choices);

			this.currentPlayer = player.id;

			this.io.to(this.id).emit('choosing', player.name);
			this.io.to(player.id).emit('choice', this.choices);
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
		this.startTime = Date.now();
		this.state = "draw";
		this.io.to(this.id).emit('go', {time: this.startTime, word: this.hiddenWord});
		//count down 60 seconds
		this.timer = setTimeout(this.end, this.drawTime * 1000);
	}

	end(){
		//display end screen;
		//return to choice
		this.state = "end";
		this.io.to(this.id).emit('end');
		//wait 3 seconds and then continue game loop
		setTimeout(this.selectWord, 3000);
	}
}

module.exports = Room;
