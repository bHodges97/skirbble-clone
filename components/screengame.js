import Canvas from "./canvas"
import PlayerList from "./playerlist"
import ChatArea from "./chatarea"

class ScreenGame extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="screenGame">
        <div className="gameHeader">
          <div className="timerContainer">
            <div id="timer">80</div>
          </div>
          <div id="round">Round 1 of 3</div>
          <div id="currentWord"></div>
          <div className="gameHeaderButtons"/>
        </div>
        <div className="containerGame">
          <PlayerList/>
          <div id="containerBoard">
            <div id="containerCanvas">
              <Canvas/>
              <div id="overlay" style={{opacity: "0%"}}>
                <div className="content" style={{background: "0%"}}>
                  <div className="text">
                  </div>
                  <div className="revealReason">
                  </div>
                  <div className="wordContainer">
                  </div>
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

export default ScreenGame
