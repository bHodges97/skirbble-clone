
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

module.exports = Room;
