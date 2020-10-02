import React from "react"
import Avatar from "./avatar"

class AvatarSelector extends React.Component {
  constructor(props) {
    super(props);
    //*this.handleClick = this.handleClick.bind(this); 
  }

  handleClick(e) {
    //this.setState(state => ({}));  
  }

  render() {
    return (
      <div id="loginAvatarCustomizeContainer">
        <div className="avatarArrows">
          <div className="avatarArrow" data-index="0"></div>
          <div className="avatarArrow" data-index="1"></div>
          <div className="avatarArrow" data-index="2"></div>
        </div>
        <div className="avatarContainer">
          <Avatar/>
        </div>
        <div className="avatarArrows">
          <div className="avatarArrow avatarArrowRight" data-index="0"></div>
          <div className="avatarArrow avatarArrowRight" data-index="1"></div>
          <div className="avatarArrow avatarArrowRight" data-index="2"></div>
        </div>
      </div>
  )
  }
}

export default AvatarSelector
