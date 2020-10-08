import SocketContext from "./socketcontext"
import Avatar from "./avatar"


class PlayerList extends React.Component {
  constructor(props) {
    super(props);

    this.renderPlayer = this.renderPlayer.bind(this);
  }

  componentDidMount(){
    this.socket = this.context;
  }

  renderPlayer(player){
    let isCurrentPlayer = player.id == this.socket.id;
    return (
      <div className={`player ${player.change>0?"guessed":"guessing"}`} key={player.id}>
        <div className="rank">
          #1
        </div>
        <div className="info">
          <div className="name" style={{color: isCurrentPlayer && "#00f"}}>
            {player.name} {isCurrentPlayer && " (You)"}
          </div>
          <div className="score">
            Points: {player.score}
          </div>
        </div>
        <Avatar scale={48} hat={player.hat} color={player.color} face={player.face}/>
      </div>
    )
  }

  render() {

    return (
      <div id="containerPlayerlist">
        <div className="containerGamePlayers">
          {this.props.players.map((player)=>this.renderPlayer(player))}
        </div>
        <button id="votekick" className="btn btnWarning btnBlock">
          Votekick
        </button>
      </div>
    )
  }
}
PlayerList.contextType = SocketContext;

export default PlayerList
