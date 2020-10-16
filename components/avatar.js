import React from "react"

class Avatar extends React.Component {
  constructor(props) {
    super(props);
    let px = `${this.props.scale * 10}px`
    this.state = {bgSize : `${px} ${px}`};
  }

  getOffset(offset){
    let y = `${offset % 10 * -this.props.scale}px`
    let x = `${~~(offset / 10) * -this.props.scale}px`
    return `${y} ${x}`
  }

  render() {
    return (
      <div className={`avatar ${this.props.style!=undefined?this.props.style:""}`}>
        <div className="colors" style={{"backgroundSize": this.state.bgSize, "backgroundPosition": this.getOffset(this.props.color)}}/>
        <div className="faces" style={{"backgroundSize": this.state.bgSize, "backgroundPosition": this.getOffset(this.props.face)}}/>
        <div className="hats" style={{"backgroundSize": this.state.bgSize, "backgroundPosition": this.getOffset(this.props.hat)}}/>
      </div>
    )
  }
}

export default Avatar
