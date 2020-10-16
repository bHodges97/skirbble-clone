
module.exports = class {
	constructor(id, name, hat, face, color) {
		this.id = id;
		this.name = name;
		this.hat = hat;
		this.face = face;
		this.color = color;
		//player has drawn once this round.
		this.participated = false;
		//player score and score change.
		this.score = 0;
		this.scoreDelta = 0;
	}
	
	static validate(user) {
		if(typeof(user) !== 'object' || !('name' in user) || user.name.length > 32){
			return false	
		}

		let keys = ['hat','face','color'];
		for (const key of keys){
			if(!(key in user) || !Number.isInteger(user[key]) || user[key] < 0 || user[key] > 13){
				return false
			}
		}	
		return [user.name, user.hat, user.face, user.color]
	}

	publicInfo(){
		return {
			id: this.id,
			name: this.name,
			hat: this.hat,
			face: this.face,
			color: this.color,
			score: this.score,
			change: this.scoreDelta,
		}
	}
}
