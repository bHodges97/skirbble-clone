import React from "react"
import Avatar from "./avatar"

class AvatarSelector extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this); 
    let rand = ()=> Math.floor(Math.random() * 13);

    this.state = {
      hat: rand(),
      face: rand(),
      color: rand(),
      scale:96
    }
    props.update("hat", this.state.hat)
    props.update("face", this.state.face)
    props.update("color", this.state.color)
  }

  handleClick(i,j) {
    let a = this.state[i] + j
    if(a<0)a=13;
    if(a>13)a=0;
    this.setState({[i]: a});  
    this.props.update(i, a)
  }

  render() {
    return (
      <div id="loginAvatarCustomizeContainer">
        <div className="avatarArrows">
          <div className="avatarArrow" onClick={()=>this.handleClick("hat",-1)}></div>
          <div className="avatarArrow" onClick={()=>this.handleClick("face",-1)}></div>
          <div className="avatarArrow" onClick={()=>this.handleClick("color",-1)}></div>
        </div>
        <div className="avatarContainer">
          <Avatar style="avatarFit" hat={this.state.hat} face={this.state.face} color={this.state.color} scale={this.state.scale}/>
        </div>
        <div className="avatarArrows">
          <div className="avatarArrow avatarArrowRight" onClick={()=>this.handleClick("hat",1)}></div>
          <div className="avatarArrow avatarArrowRight" onClick={()=>this.handleClick("face",1)}></div>
          <div className="avatarArrow avatarArrowRight" onClick={()=>this.handleClick("color",1)}></div>
        </div>
      </div>
  )
  }
}

export default AvatarSelector
