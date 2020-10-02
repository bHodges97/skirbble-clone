import React from "react"
import Avatar from "./avatar"

class AvatarSelector extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this); 
    this.state = {data:{0:0,1:0,2:0,scale:96}}
  }

  handleClick(e,i,j) {
    let arr = this.state.data
    let a = arr[i] + j
    if(a<0)a=13;
    if(a>13)a=0;
    arr[i] = a
    this.setState(state => ({data: arr}));  
  }

  render() {
    return (
      <div id="loginAvatarCustomizeContainer">
        <div className="avatarArrows">
          <div className="avatarArrow" onClick={(e)=>this.handleClick(e,0,-1)}></div>
          <div className="avatarArrow" onClick={(e)=>this.handleClick(e,1,-1)}></div>
          <div className="avatarArrow" onClick={(e)=>this.handleClick(e,2,-1)}></div>
        </div>
        <div className="avatarContainer">
          <Avatar data={this.state.data}/>
        </div>
        <div className="avatarArrows">
          <div className="avatarArrow avatarArrowRight" onClick={(e)=>this.handleClick(e,0,1)}></div>
          <div className="avatarArrow avatarArrowRight" onClick={(e)=>this.handleClick(e,1,1)}></div>
          <div className="avatarArrow avatarArrowRight" onClick={(e)=>this.handleClick(e,2,1)}></div>
        </div>
      </div>
  )
  }
}

export default AvatarSelector
