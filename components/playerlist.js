import SocketContext from "./socketcontext"


class PlayerList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
    };
  }

  
  componentDidMount(){
    this.socket = this.context
    this.socket.on('now', data =>{
      this.setState({
        test: data.message
      })
    })
    this.socket.on('players', (data)=>{
      for(let i = 0; i < data.length; i++){
        
      }
      console.log("hello");
      console.log(this.socket.id);
      console.log(data);
    });
  }

  render() {
    return (
      <div id="containerPlayerlist">
        <div id="containerGamePlayers">
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
