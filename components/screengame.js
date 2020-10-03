import Canvas from "./canvas"

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
          <div id="containerPlayerlist">
          </div>
          <div id="containerBoard">
            <div id="containerCanvas">
              <Canvas/>
            </div>
          </div>
          <div id="containerSidebar">
            <div id="containerChat">
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default ScreenGame
