import React from "react"
import Toolbox from "./toolbox"
import Overlay from "./overlay"

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
    this.state = {
      context: null,
      color: '#000000',
      tool: 'pen',
      width: 6,
    };
    this.toolSelect = this.toolSelect.bind(this);
    this.clear = this.clear.bind(this);
  }

  componentDidMount() {
    const ref = this.canvasRef.current;
    ref.width = ref.offsetWidth;
    ref.height = ref.offsetHeight;
    let ctx = ref.getContext('2d');
    ctx.lineJoin = 'round';
    ctx.fillStyle = 'white';
    //why is react like this????
    //ctx is not defined if i just do this.context = ....
    this.setState({context: ctx});
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
    if (this.isDrawing && this.state.tool!=='fill') {
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
    ctx.strokeStyle = this.state.tool==='pen'?this.state.color:'white';
    ctx.lineWidth = this.state.width;
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.closePath();
    ctx.stroke();
  }

  hexToRgb(hex) {
    var bigint = parseInt(hex, 16);
    var r = (bigint >> 16) & 255;
    var g = (bigint >> 8) & 255;
    var b = bigint & 255;
    return [r,g,b];
  }

  floodFill(x,y) {
    const ctx = this.state.context;
    let image = ctx.getImageData(0,0,ctx.canvas.width,ctx.canvas.height);
    //data is 1d array of rgba valuess
    let data = image.data;
    let width = image.width;
    let height = image.height;
    let target = 4*(x+y*width)
    let newColor = hexToRgb(this.state.color);
    let oldColor = data.slice(x,3)
    let queue = [target]
    const comp = (x)=>{data[x]==oldColor[0] && data[x+1]==oldColor[1] && data[x+2]==oldColor[2]}

    while(queue.length) {
      let next = queue.pop()
      let c = next;
      while(c >= 0 && c < data.length && comp[c]){
        data.splice(c,3,...newColor);
        next.push(c+width);
        next.push(c-width);
        c+=4;
      }
      c = next-4;
      while(c >= 0 && c < data.length && comp[c]){
        data.splice(c,3,...newColor);
        next.push(c+width);
        next.push(c-width);
        c-=4;
      }
    }
  }

  toolSelect(e){
    this.setState({[e.dataset.type]: e.dataset.value})
  }

  clear(){
    const ctx = this.state.context;
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  }

  render() {
    return (
      <div id="containerBoard">
        <div id="containerCanvas">
          <canvas className="doodleArea" ref={this.canvasRef} width="800" height="600" onMouseDown={this.mouseDown} onMouseMove={this.mouseMove} onMouseUp={this.mouseUp} onMouseLeave={()=>this.isInside=false} onMouseEnter={()=>this.isInside=true}/>
          {this.props.overlay &&
          <Overlay overlay={this.props.overlay} text={this.props.text} choice={this.props.choice} reason={this.props.reason} scores={this.props.scores}/>
          }
        </div>
      <Toolbox callback={this.toolSelect} clear={this.clear}/>
      </div>
    );
  }
}

export default Canvas
