import Canvas from "./canvas"
import PlayerList from "./playerlist"
import ChatArea from "./chatarea"
import SocketContext from "components/socketcontext"

class ScreenGame extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      overlay: false,
      text: '',
      choice: undefined, 
      word: '',
      reason: '',
      scores: undefined,
      round: 1,
      timer: 80,
      end: null,
      players: [],
      drawing: false,
    };
  }

  tick(){
    if(this.state.end) {
      this.setState({
        timer: Math.max(0, ~~((this.state.end - Date.now()) / 1000)),
      })
    } else {
      this.setState({
        timer: 80,
      })
    }
  }

  updateRanks(players) {
    let ranks = players.map(x=>x.score).sort().reverse();
    let updated = []
    for(let player of players) {
      updated.push({...player, rank: ranks.indexOf(player.score) + 1});
    }
    console.log(ranks)
    console.log(updated)
    return updated;
  }

  componentDidMount() {
    this.socket = this.context;
    this.socket.on('secret', (data)=>{
      this.setState({
        overlay: false,
        text: '',
        choice: undefined,
        reason: '',
        scores: undefined,
        word: data.word,
        timer: 80,
        end: data.time,
        drawing: this.socket.id == data.drawing,
      })

      this.timerID = setInterval(
        () => this.tick(), 100
      );
    });

    this.socket.on('round', (data)=>{
      this.setState({
        round: data,
        overlay: true,
        text: "Round: " + data,
      });
    });

    this.socket.on('end', (data)=>{
      clearInterval(this.timerID);
      this.setState({
        overlay: true,
        reason: data.reason,
        scores: data.scores,
        text: `The word was '${data.word}'.`,
        timer: 0
      })

      let players = [... this.state.players]
      for(let i = 0;i < players.length; i++){;
        players[i] = {...players[i], change: 0}
        break;
      }
      this.setState({players: players});
    })

    this.socket.on('choosing', (data)=>{
      this.setState({
        overlay: true,
        text: `${data} is choosing a word`,
        reason: '',
        scores: undefined,
      })
    });

    this.socket.on('choice', (data)=>{
      this.setState({
        overlay: true,
        text: "Choose a word",
        choice: data,
        reason: '',
        scores: undefined,
      })
    });
    
    //player update listeners
    this.socket.on('roominfo', (data)=>{
      let players = this.updateRanks(data.players);
      this.setState({players: players, round: data.round})
    });

    this.socket.on('playerjoined', (data)=>{
      let players = this.updateRanks([...this.state.players, data]);
      this.setState({players: players});
    });

    this.socket.on('playerleft', (data)=>{
      let players = this.updateRanks(this.state.players.filter(x=>x.id!=data));
      this.setState({players: players});
    });

    this.socket.on('update', (data)=>{
      let players = this.updateRanks(this.state.players);
      console.log("update",players)
      
      for(let i=0; i < players.length; i++){
        if(players[i].id === data.id){
          players[i] = {...players[i], score: data.score, change: 1}
        }
      }
      this.setState({players: players});
    });
  }

  render() {
    return (
      <div className="screenGame">
        <div className="gameHeader">
          <div className="timerContainer">
            <div id="timer">{this.state.timer}</div>
          </div>
          <div id="round">Round {this.state.round} of 3</div>
          <div id="currentWord">{this.state.word}</div>
          <div className="gameHeaderButtons"/>
        </div>
        <div className="containerGame">
          <PlayerList players={this.state.players}/>
          <Canvas overlay={this.state.overlay} text={this.state.text} choice={this.state.choice} reason={this.state.reason} scores={this.state.scores} drawing={this.state.drawing}/>
          <div id="containerSidebar">
            <div id="containerFreespace"/>
            <ChatArea/>
          </div>
        </div>
      </div>
    )
  }
}
ScreenGame.contextType = SocketContext;
export default ScreenGame
