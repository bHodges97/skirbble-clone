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
  }

  componentDidMount() {
    const ref = this.canvasRef.current;
    ref.width = ref.offsetWidth;
    ref.height = ref.offsetHeight;
    this.context = ref.getContext('2d');
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
    if (this.isDrawing) {
      this.drawLine(this.x, this.y, e.nativeEvent.offsetX, e.nativeEvent.offsetY);
      this.x = 0;
      this.y = 0;
      this.isDrawing = false;
    }
  }

  drawLine(x1, y1, x2, y2) {
    const ctx = this.context;
    ctx.strokeRect(0, 0, 150, 150);

    ctx.beginPath();
    //ctx.strokeStyle = 'black';
    ctx.lineWidth = 10;
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.closePath();
    ctx.stroke();
  }

  render() {
    return (
      <canvas className="doodleArea" ref={this.canvasRef} width="800" height="600" onMouseDown={this.mouseDown} onMouseMove={this.mouseMove} onMouseUp={this.mouseUp} onMouseLeave={()=>this.isDrawing=false}>
      </canvas>
    );
  }
}

export default Canvas
