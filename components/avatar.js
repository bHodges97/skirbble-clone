import React from "react"

class Avatar extends React.Component {
  constructor(props) {
    super(props);
    this.getBgSize = this.getBgSize.bind(this); 
    //
    this.state = {
      hats: 1,
      faces: 2,
      colors: 3,
      bgscale: 96
    };
  }

  getBgSize(){
    let px = String(this.state.bgscale * 10)+"px"
    return px + " " + px
  }

  getOffset(offset){
    let y = String(offset % 10) + "px"
    let x = String(Math.floor(offset / 100)) + "px"
    return y + " " + x
  }

  render() {
    return (
      <div className="avatar avatarFit">
        <div className="colors" style={{"backgroundSize": this.getBgSize(), "backgroundPosition": this.getOffset(this.state.colors)}}/>
        <div className="faces" style={{"backgroundSize": this.getBgSize(), "backgroundPosition": this.getOffset(this.state.faces)}}/>
        <div className="hats" style={{"backgroundSize": this.getBgSize(), "backgroundPosition": this.getOffset(this.state.hats)}}/>
      </div>
    )
  }
}

export default Avatar
