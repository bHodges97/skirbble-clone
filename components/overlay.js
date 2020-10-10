import SocketContext from "components/socketcontext"

class Overlay extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount(){
    this.socket = this.context;
  }


  render() {
    return (
      <div id="overlay" style={{opacity: this.props.overlay?"1":"0"}}>
        <div className="content" style={{bottom: "0%"}}>
          {this.props.text != "" &&
            <div className="text">
              {this.props.text}
            </div>
          }
          {this.props.choice != undefined && 
            <div className="wordContainer">
              {this.props.choice.map((x,i)=>
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
          {this.props.reason!='' &&
            <div className="revealReason">
              {this.props.reason}
            </div>
          }
          {this.props.scores != undefined &&
            <div className="revealContainer">
              {this.props.scores.map((x,i)=>
                <div className="player" key={i}>
                <div className="name">{x.name}</div>
                <div className="score" style={{color: x.change==0?'#e81300':'#07ea30'}}>{x.change==0?x.change:'+'+x.change}</div> 
                </div>
              )}
            </div>
          }
          </div>
        </div>
    )
  }
}
Overlay.contextType = SocketContext;
export default Overlay
