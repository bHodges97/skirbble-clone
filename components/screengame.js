import Canvas from "./canvas"
import PlayerList from "./playerlist"

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
            </div>
          </div>
          <div id="containerSidebar">
            <div id="containerFreespace"/>
            <div id="containerChat">
              <div id="boxChat">
                <div id="boxMessages"/>
                <div id="boxChatInput">
                  <form id="formChat">
                    <input id="inputChat" class="formControl" autoComplete="off" type="text" placeholder="Type your guess here..." maxLength="100"/>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default ScreenGame
