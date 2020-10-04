import React from "react"

class Avatar extends React.Component {
  constructor(props) {
    super(props);
    this.getBgSize = this.getBgSize.bind(this); 
  }

  getBgSize(){
    let px = String(this.props.scale * 10)+"px"
    return px + " " + px
  }

  getOffset(offset){
    let y = String(offset % 10) * - this.props.scale + "px"
    let x = String(Math.floor(offset / 10)) * - this.props.scale + "px"
    return y + " " + x
  }

  render() {
    return (
      <div className="avatar avatarFit">
        <div className="colors" style={{"backgroundSize": this.getBgSize(), "backgroundPosition": this.getOffset(this.props.color)}}/>
        <div className="faces " style={{"backgroundSize": this.getBgSize(), "backgroundPosition": this.getOffset(this.props.face)}}/>
        <div className="hats  " style={{"backgroundSize": this.getBgSize(), "backgroundPosition": this.getOffset(this.props.hat)}}/>
      </div>
    )
  }
}

export default Avatar
