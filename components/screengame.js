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
      round: 0,
      timer: 80,
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
      this.setState({
        overlay: false,
        text: '',
        choice: undefined,
        reason: '',
        scores: undefined,
        word: data.word,
        timer: Math.floor(80 - (Date.now() - data.time) / 1000),
      })

      this.timerID = setInterval(
        () => this.tick(), 1000
      );
    });

    this.socket.on('round', (data)=>{
      clearInterval(this.timerID);
      this.setState({
        round: data,
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
          <PlayerList/>
          <div id="containerBoard">
            <div id="containerCanvas">
              <Canvas/>
              <div id="overlay" style={{opacity: this.state.overlay?"1":"0"}}>
                <div className="content" style={{bottom: "0%"}}>
                  {this.state.text != "" &&
                    <div className="text">
                      {this.state.text}
                    </div>
                  }
                  {this.state.choice != undefined && 
                    <div className="wordContainer">
                      {this.state.choice.map((x,i)=>
                          <div
                            className="word"
                            key={i}
                            onClick={()=>{
                              this.socket.emit('choice',i);
                            }}
                          >
                          {x}
                          </div>
                        
                      )}
                    </div>
                  }
                  {this.state.reason!='' &&
                    <div className="revealReason">
                      {this.state.reason}
                    </div>
                  }
                  {this.state.scores != undefined &&
                    <div className="revealContainer">
                      {this.state.scores.map((x,i)=>
                        <div className="player" key={i}>
                        <div className="name">{x.name}</div>
                        <div className="score" style={{color: x.change==0?'#e81300':'#07ea30'}}>{x.change==0?x.change:'+'+x.change}</div> 
                        </div>
                      )}
                    </div>
                  }
                  <div className="gameEndContainer">
                  </div>
                </div>
              </div>
            </div>
          </div>
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
