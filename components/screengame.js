import React from "react"
import Canvas from "./canvas"
import PlayerList from "./playerlist"
import ChatArea from "./chatarea"
import SocketContext from "components/socketcontext"

class ScreenGame extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      gameState: 'lobby',
      text: '',
      choice: undefined, 
      word: '',
      reason: '',
      round: 1,
      timer: 80,
      end: null,
      players: [],
      drawer: null,
      drawing: false,
    };
  }

  tick(){
    if(this.state.end) {
      let timeleft = ~~((this.state.end - Date.now()) / 1000);
      this.setState({
        timer: Math.max(0, Math.min(this.state.timer, timeleft)),
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
    return updated;
  }

  componentDidMount() {
    this.socket = this.context;
    this.socket.on('secret', (data)=>{
      this.setState({
        gameState: 'drawing',
        text: '',
        choice: undefined,
        reason: '',
        word: data.word,
        drawer: data.drawing,
        drawing: this.socket.id == data.drawing,
      })
    });

    this.socket.on('timer', (data)=>{
      this.setState({
        timer: data.time,
        end: data.end,
      });
      this.timerID = setInterval(
        () => this.tick(), 100
      );
    });

    this.socket.on('round', (data)=>{
      this.setState({
        round: data,
        gameState: 'roundStart',
        text: "Round: " + data,
      });
    });

    this.socket.on('end', (data)=>{
      clearInterval(this.timerID);
      this.setState({
        drawer: null,
        drawing: false,
        gameState: 'roundEnd',
        reason: data.reason,
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

    this.socket.on('gameEnd', (data)=>{
      this.setState({
        gameState: 'gameEnd',
      });
    });


    this.socket.on('choosing', (data)=>{
      this.setState({
        gameState: 'choosing',
        text: `${data} is choosing a word`,
        reason: '',
      })
    });

    this.socket.on('choice', (data)=>{
      this.setState({
        gameState: 'choosing',
        text: "Choose a word",
        choice: data,
        reason: '',
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
      
      for(let i=0; i < players.length; i++){
        if(players[i].id === data.id){
          players[i] = {
            ...players[i],
            score: data.score,
            change: data.score-this.state.players[i].score
          };
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
          <PlayerList players={this.state.players} drawer={this.state.drawer}/>
          <Canvas gameState={this.state.gameState} text={this.state.text} choice={this.state.choice} reason={this.state.reason} players={this.state.players} drawing={this.state.drawing}/>
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
