const wordlist = require('./words.js');

//TODO: 
//handle game state if active  player disconnects
//save current drawing
//ensure words chosen are unique
//add stop game when player count is low

class Room{
	constructor(id,io){
		this.id = id;
		this.io = io;
		//game loop: lobby -> choice -> draw -> end
		this.players = new Array(10);
		this.playerCount = 0;
		this.resetState();
	}

	resetState(){
		this.state = "lobby";
		this.currentPlayer = null;
		this.word = "";
		this.hiddenWord = "";
		this.compareWord = "";
		this.choices = ['','',''];
		this.round = 0;
		this.image = "";
		this.startTime = Date.now();
		this.drawTime = 80;
		clearTimeout(this.timeout);
		this.timer = null;
		for(let player of this.players.filter((x)=>x!=undefined)){
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
			this.newRound();
		}
	}

	newRound(){
		this.round += 1;

		console.log("Round: ", this.round);
		for(let player of this.players.filter((x)=>x!=undefined)){
			player.participated = false;
		}
		this.io.to(this.id).emit("round", this.round);

		this.timer = setTimeout(()=>{this.selectWord()}, 500);
	}

	selectWord(){
		if(this.playerCount < 2){
			//prevent game from playing when no one is on
			return
		}
		//select player first
		let player = null;
		for(let p of this.players){
			if(p != undefined && !p.participated){
				p.participated = true;
				player = p;
				break
			}
		}
		if(player == null){
			this.newRound();
		}else{
			this.state = "choice";
			//select three words
			for(let i = 0; i < 3; i++){
				this.choices[i] = wordlist.sample();
			}
			console.log(this.choices);

			this.currentPlayer = player.id;
			
			for(let p of this.players){
				if(p != undefined && p.id != player.id){
					this.io.to(p.id).emit('choosing', player.name);
					console.log(p.id)
				}
			}
			this.io.to(player.id).emit('choice', this.choices);
		}
	}
	
	//on player connect to room
	addPlayer(data, id){
		for(let i=0;i < this.players.length; i++){
			if(this.players[i] === undefined){
				this.players[i] = data;
				this.players[i].score = 0;
				this.players[i].id = id;
				this.players[i].participated = false;
				this.players[i].change = 0;
				this.playerCount+=1
				this.updateStatus()
				return i
			}
		}
	}

	getPlayer(id){
		return this.players.filter((x)=>x.id==id).pop()
	}

	//on player leave to room
	removePlayer(id){
		for(let i=0; i < this.players.length; i++){
			if(this.players[i] !== undefined && this.players[i].id == id){
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
		let secret = {time: this.startTime, word: this.hiddenWord}
		for(let x of this.players){
			if(x!=undefined && x.id!=this.currentPlayer){
				this.io.to(this.id).emit('secret', secret);
			}
		}
		this.io.to(this.currentPlayer).emit('secret', {time: this.startTime, word: this.word});
		//count down 60 seconds
		this.timer = setTimeout(()=>{this.end("timeout")}, this.drawTime * 1000);
	}

	end(reason){
		console.log(reason, Date.now()-this.startTime)
		//display end screen;
		//return to choice
		this.state = "end";
		//send results in descending order
		let deltas = this.players.filter((x)=>x!=undefined).map((x)=>{return {name: x.name, change: x.change}});
		deltas.sort((x,y)=>y.change-x.change)

		this.io.to(this.id).emit('end', {reason: reason, scores: deltas ,word: this.word});
		//wait 3 seconds and then continue game loop
		setTimeout(()=>{this.selectWord()}, 15000);
	}
}

module.exports = Room;
