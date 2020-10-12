import React from "react"

class Canvas extends React.Component {
  constructor(props) {
    super(props);
    this.canvasRef = React.createRef();
    this.mouseDown = this.mouseDown.bind(this); 
    this.mouseUp = this.mouseUp.bind(this); 
    this.mouseMove = this.mouseMove.bind(this); 
    this.drawLine = this.drawLine.bind(this); 
    this.x = 0;
    this.y = 0;
    this.isDrawing = false;
    this.isInside = false;
    this.state = {context: null};
  }

  componentDidMount() {
    const ref = this.canvasRef.current;
    ref.width = ref.offsetWidth;
    ref.height = ref.offsetHeight;
    //why is react like this????
    //ctx is not defined if i just do this.context = ....
    this.setState({context: ref.getContext('2d')});
  }


  mouseDown(e) {
    this.x = e.nativeEvent.offsetX;
    this.y = e.nativeEvent.offsetY;
    this.isDrawing = true;
  }

  mouseMove(e) {
    if (this.isDrawing === true) {
      this.drawLine(this.x, this.y, e.nativeEvent.offsetX, e.nativeEvent.offsetY);
      this.x = e.nativeEvent.offsetX;
      this.y = e.nativeEvent.offsetY;
    }
  }

  mouseUp(e) {
    if (this.isDrawing && this.props.tool!=='fill') {
      this.drawLine(this.x, this.y, e.nativeEvent.offsetX, e.nativeEvent.offsetY);
      this.x = 0;
      this.y = 0;
      this.isDrawing = false;
    }
  }

  drawLine(x1, y1, x2, y2) {
    if(!this.isInside || !this.state.context)return;

    const ctx = this.state.context;

    ctx.beginPath();
    ctx.strokeStyle = this.props.tool==='pen'?this.props.color:'white';
    ctx.lineWidth = this.props.width;
    ctx.lineJoin = 'round';
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.closePath();
    ctx.stroke();
  }

  render() {
    return (
      <canvas className="doodleArea" ref={this.canvasRef} width="800" height="600" onMouseDown={this.mouseDown} onMouseMove={this.mouseMove} onMouseUp={this.mouseUp} onMouseLeave={()=>this.isInside=false} onMouseEnter={()=>this.isInside=true}>
      </canvas>
    );
  }
}

export default Canvas
