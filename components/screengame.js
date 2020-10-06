import Canvas from "./canvas"
import PlayerList from "./playerlist"
import ChatArea from "./chatarea"
import SocketContext from "components/socketcontext"

class ScreenGame extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: '',
      choice: undefined, 
      word: '',
      timer: 80,
    };
  }

  tick(){
    this.setState({
      timer: this.state.timer - 1, 
    })
  }


  componentDidMount(){
    this.socket = this.context;
    this.socket.on('secret', (data)=>{
      console.log(data)
      this.setState({
        text: '',
        choice: undefined,
        word: data.word,
        timer: Math.floor(80 - (Date.now() - data.time) / 1000),
      })

      this.timerID = setInterval(
        () => this.tick(),
        1000
      );
    });

    this.socket.on('choosing', (data)=>{
      this.setState({
        text: data + " is choosing a word"
      })
    });
    this.socket.on('choice', (data)=>{
      this.setState({
        text: "Choose a word",
        choice: data,
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
          <div id="round">Round 1 of 3</div>
          <div id="currentWord">{this.state.word}</div>
          <div className="gameHeaderButtons"/>
        </div>
        <div className="containerGame">
          <PlayerList/>
          <div id="containerBoard">
            <div id="containerCanvas">
              <Canvas/>
              <div id="overlay" style={{opacity: "1"}}>
                <div className="content" style={{bottom: "0%"}}>
                  {this.state.text != "" &&
                    <div className="text">
                      {this.state.text}
                    </div>
                  }
                  <div className="revealReason">
                  </div>
                  {this.state.choice != undefined && 
                    <div className="wordContainer">
                      {this.state.choice.map((x,i)=>{
                        return (
                          <div
                            className="word"
                            key={i}
                            onClick={()=>{
                              this.socket.emit('choice',i);
                            }}
                          >
                          {x}
                          </div>
                        )
                      })}
                    </div>
                  }
                  <div className="revealContainer">
                  </div>
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
