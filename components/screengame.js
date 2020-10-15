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
      players: [],
      drawing: false,
    };
  }

  tick(){
    if(this.state.timer == 0){
      return
    }
    this.setState({
      timer: this.state.timer - 1, 
    })
  }

  componentDidMount(){
    this.socket = this.context;
    this.socket.on('secret', (data)=>{
      console.log("data",data);
      this.setState({
        overlay: false,
        text: '',
        choice: undefined,
        reason: '',
        scores: undefined,
        word: data.word,
        timer: Math.floor(80 - (Date.now() - data.time) / 1000),
        drawing: this.socket.id == data.drawing,
      })

      this.timerID = setInterval(
        () => this.tick(), 1000
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
        text: "The word was '" + data.word + "'.",
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
        text: data + " is choosing a word",
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
      this.setState({players: data.players, round: data.round})
    });

    this.socket.on('playerjoined', (data)=>{
      let players = [... this.state.players]
      players[data.index] = data.player;
      this.setState({players: players});
    });

    this.socket.on('playerleft', (data)=>{
      let players = this.state.players.filter(x=>x.id!=data);
      this.setState({players: players});
    });

    this.socket.on('update', (data)=>{
      let players = [... this.state.players]
      
      for(let i=0; i < players.length; i++){
        if(players[i].id == data.id){
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
