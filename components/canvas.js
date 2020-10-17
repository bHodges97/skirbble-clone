import React from "react"
import Toolbox from "./toolbox"
import Overlay from "./overlay"
import TOOL from "./tool"
import SocketContext from "components/socketcontext"


class Canvas extends React.Component {
  constructor(props) {
    super(props);
    this.canvasRef = React.createRef();
    this.mouseDown = this.mouseDown.bind(this); 
    this.mouseUp = this.mouseUp.bind(this); 
    this.mouseMove = this.mouseMove.bind(this); 
    this.drawLine = this.drawLine.bind(this); 
    this.x = null;
    this.y = null;
    this.isDrawing = false;
    this.isInside = false;
    this.state = {
      context: null,
      color: 11,
      tool: TOOL.PEN,
      width: 0,
      drawing: false,
    };
    this.toolSelect = this.toolSelect.bind(this);
    this.floodFill = this.floodFill.bind(this);
    this.clear = this.clear.bind(this);
  }

  componentDidMount() {
    const ref = this.canvasRef.current;
    //ref.width = ref.offsetWidth;
    //ref.height = ref.offsetHeight;
    let ctx = ref.getContext('2d');
    let scaleX = ref.width/ref.offsetWidth; 
    let scaleY = ref.height/ref.offsetHeight;
    //ref.width = ref.offsetWidth;
    //ref.height = ref.offsetHeight;
    //why is react like this????
    //ctx is not defined if i just do this.context = ....
    this.setState({context: ctx, scaleX: scaleX, scaleY: scaleY});

    ctx.lineJoin = 'round';
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    this.canvas = document.createElement("canvas");
    this.canvas.height = ref.height
    this.canvas.width = ref.width
    const ctx2 = this.canvas.getContext('2d');
    ctx2.lineJoin = 'round';
    ctx2.fillStyle = 'white';
    this.setState({ctx2: ctx2});

    this.context.on('tool', (data) => {
      this.setState({tool: data[0]})
      if(data[0] != TOOL.RUBBER){
        this.setState({color: data[1], width: data[2]}); 
      }
    });
    this.context.on('draw', (data) => {
      let x = data[0];
      let y = data[1];
      if(this.state.tool == TOOL.FILL){
        this.floodFill(x,y);
      }else{
        if(this.x != null && this.y != null){
          this.drawLine(this.x, this.y, x, y);
        }
        this.x = x;
        this.y = y;
        const ctx2 = this.state.ctx2;
        ctx2.clearRect(0, 0, ctx2.canvas.width, ctx2.canvas.height);
      }
    });
    this.context.on('clear', (data) => {
      this.clear();
    });
  }

  mouseDown(e) {
    if(e.button!=0 || !this.props.drawing)return
    let x = ~~(e.nativeEvent.offsetX * this.state.scaleX);
    let y = ~~(e.nativeEvent.offsetY * this.state.scaleY);
    this.context.emit('draw',[x, y]);
    if(this.state.tool !== TOOL.FILL) {
      this.x = x;
      this.y = y;
      this.isDrawing = true;
    }else {
      this.floodFill(x,y);
    }
  }

  mouseMove(e) {
    if (this.props.drawing && this.isDrawing === true && this.state.tool !== TOOL.FILL) {
      let x = ~~(e.nativeEvent.offsetX * this.state.scaleX);
      let y = ~~(e.nativeEvent.offsetY * this.state.scaleY);
      this.context.emit('draw',[x, y]);
      this.drawLine(this.x, this.y, x, y);
      this.x = x;
      this.y = y;
    }
  }

  mouseUp(e) {
    if (this.props.drawing && this.isDrawing && this.state.tool!==TOOL.FILL) {
      let x = ~~(e.nativeEvent.offsetX * this.state.scaleX);
      let y = ~~(e.nativeEvent.offsetY * this.state.scaleY);
      this.context.emit('draw',[this.x * this.state.scaleX,this.y * this.state.scaleY])
      this.drawLine(this.x, this.y, x, y);
      this.x = null;
      this.y = null;
      this.isDrawing = false;
      const ctx2 = this.state.ctx2;
      ctx2.clearRect(0, 0, ctx2.canvas.width, ctx2.canvas.height);
    }
  }

  drawLine(x0,y0,x1,y1){
    const ctx = this.state.context;
    const ctx2 = this.state.ctx2;
    //draw line on hidden canvas as a mask for the actual canvas.
    //gets rid of fuzzy edges 
    let image = ctx.getImageData(0,0,ctx.canvas.width,ctx.canvas.height);
    let data = image.data;
    let w = TOOL.WIDTH[this.state.width];
    let height = image.height;
    let width = image.width;
    let color = this.state.tool===TOOL.PEN?TOOL.COLOR[this.state.color]:'#ffffff';
    ctx2.beginPath();
    ctx2.strokeStyle = color;
    ctx2.lineWidth = w;
    ctx2.moveTo(x0, y0);
    ctx2.lineTo(x1, y1);
    ctx2.closePath();
    ctx2.stroke();
    let image2 = ctx2.getImageData(0,0,width,height);
    let d2 = image2.data;

    let lx = Math.max(0, Math.min(x0,x1)-w);
    let ly = Math.max(0, Math.min(y0,y1)-w);
    let min = 4 * (lx + ly * width);
    let hx = Math.min(width, Math.max(x0,x1)+w);
    let hy = Math.min(height, Math.max(y0,y1)+w);
    let max = 4 * (hx + hy * width);

    let newColor = this.hexToRgb(color);
    for(let x = min; x <= max; x+=4){
      if(d2[x+3]){
        data[x] = newColor[0];
        data[x+1] = newColor[1];
        data[x+2] = newColor[2];
      }
    }

    ctx.putImageData(image,0,0);
  }

  hexToRgb(hex) {
    var r = parseInt(hex.slice(1,3),16);
    var g = parseInt(hex.slice(3,5),16);
    var b = parseInt(hex.slice(5,7),16);
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
    let newColor = this.hexToRgb(TOOL.COLOR[this.state.color]);
    let oldColor = data.slice(target,target+3);
    let rowWidth = width * 4;
    let queue = [target]
    const comp = (x)=>{
      return (data[x]==oldColor[0] && data[x+1]==oldColor[1] && data[x+2]==oldColor[2]) || data[x+3] < 255
    }

    if(!comp(target))return;
    if(data[target] == newColor[0] && data[target+1] == newColor[1] && data[target+2] == newColor[2])return;

    while(queue.length > 0) {
      let next = queue.pop();
      if(!comp(next))continue;

      let left = ~~(next/rowWidth) * rowWidth;
      let right = left + rowWidth;

      let e = next;
      while(e < right && comp(e)){
        data[e] = newColor[0];
        data[e+1] = newColor[1];
        data[e+2] = newColor[2];
        if(comp(e+rowWidth))queue.push(e+rowWidth);
        if(comp(e-rowWidth))queue.push(e-rowWidth);
        e+=4;
      }
      let w = next-4;
      while(w >= left && comp(w)){
        data[w] = newColor[0];
        data[w+1] = newColor[1];
        data[w+2] = newColor[2];
        if(comp(w+rowWidth))queue.push(w+rowWidth);
        if(comp(w-rowWidth))queue.push(w-rowWidth);
        w-=4;
      }
    }
    ctx.putImageData(image,0,0);
  }

  toolSelect(type, value) {
    this.x = null;
    this.y = null;
    this.setState({[type]: value},()=>{
      this.context.emit('tool', [this.state.tool,this.state.color,this.state.width]);
    });
  }

  clear(){
    const ctx = this.state.context;
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    this.context.emit('clear',[this.state.tool,this.state.color,this.state.width]);
  }

  render() {
    //using hidden for toolbox so it still takes up space
    return (
      <div id="containerBoard">
        <div id="containerCanvas">
          <canvas className="doodleArea" ref={this.canvasRef} width="800" height="600" onMouseDown={this.mouseDown} onMouseMove={this.mouseMove} onMouseUp={this.mouseUp} onMouseLeave={()=>this.isInside=false} onMouseEnter={()=>this.isInside=true}/>
          {this.props.overlay &&
          <Overlay overlay={this.props.overlay} text={this.props.text} choice={this.props.choice} reason={this.props.reason} scores={this.props.scores}/>
          }
        </div>
        <Toolbox callback={this.toolSelect} clear={this.clear} show={this.props.drawing} width={this.state.width} tool={this.state.tool} color={this.state.color}/>
      </div>
    );
  }
}
Canvas.contextType = SocketContext;

export default Canvas
