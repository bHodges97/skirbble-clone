import SocketContext from "./socketcontext"
import Avatar from "./avatar"


class PlayerList extends React.Component {
  constructor(props) {
    super(props);

    this.renderPlayer = this.renderPlayer.bind(this);

    this.state = {
      players: [],
    };
  }

  
  componentDidMount(){
    this.socket = this.context
    this.socket.on('players', (data)=>{
      this.setState({players: data})
      console.log(this.socket.id);
      console.log(data);
    });
    this.socket.on('playerjoined', (data)=>{
      let players = [... this.state.players]
      for(let i = 0;i < players.length; i++){;
        if(players[i] === null){
          players[i] = data;
          break;
        }
      }
      this.setState({players: players});
    });
    this.socket.on('playerleft', (data)=>{
      let players = [... this.state.players]
      for(let i = 0;i < players.length; i++){;
        if(players[i] != null && players[i].id == data){
          players[i] = null;
          break;
        }
      }
      this.setState({players: players});
    });
    this.socket.on('update', (data)=>{
      let players = [... this.state.players]
      
      for(let i=0; i < players.length; i++){
        if(players[i] != null && players[i].id == data.id){
          players[i] = {...players[i], score: data.score}
        }
      }
      this.setState({players: players});
    });
  }

  renderPlayer(player){
    if(player !== null){
      let isCurrentPlayer = player.id==this.socket.id;
      return (
        <div className={"player " + player.guessed} key={player.id}>
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
  }

  render() {

    return (
      <div id="containerPlayerlist">
        <div id="containerGamePlayers">
          {this.state.players.map((player)=>this.renderPlayer(player))}
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
