import React from "react"
import Avatar from "./avatar"

class GameEnd extends React.Component {
  constructor(props) {
    super(props);
  }

  
  componentDidMount(){
  }
  

  render() {
    let players = [...this.props.players].sort((a,b)=>(a.rank-b.rank));
    let top3 = players.splice(0,3);
    let top3div = top3.map(x=>{
      return (
        <div className="gameEndPlayer">
          <div className="left">
            <div className="avatarContainer">
              <Avatar style="avatarFit" scale={96} hat={x.hat} color={x.color} face={x.face}/>
            </div>
            <div className="name">{x.name}</div>
          </div>
          <div className={`rank rank${x.rank}`}>
            #{x.rank}
          </div>
        </div>
      )
    });
    let rest = players.map((x)=>{
      return (
        <div className="gameEndPlayer">
          <div className="left">
            <div className="avatarContainer">
              <Avatar style="avatarFit" scale={48} hat={x.hat} color={x.color} face={x.face}/>
            </div>
            <div className="name">{x.name}</div>
          </div>
          <div className='rank'>
            #{x.rank}
          </div>
        </div>
      )
    });

    return (
      <div className="gameEndContainer">
        <div className="gameEndContainerPlayersBest">
          {top3div}
        </div>
        <div className="gameEndContainerPlayers">
          {rest}
        </div>
      </div>
    )
  }
}

export default GameEnd

