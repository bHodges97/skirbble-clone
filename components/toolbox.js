import TOOL from "./tool"

class Toolbox extends React.Component {
  constructor(props) {
    super(props);
    this.renderColorItem = this.renderColorItem.bind(this);
    this.changeColor = this.changeColor.bind(this);
    this.changeTool = this.changeTool.bind(this);
  }

  
  componentDidMount(){
  }

  renderColorItem(x){
    return (
      <div className="colorItem" style={{backgroundColor: TOOL.COLOR[x]}} key={x} data-type='color' data-value={x} onClick={this.changeColor}/>
    )
  }
  
  changeColor(e) {
    if(this.props.tool === TOOL.RUBBER) {
      this.props.callback('tool', TOOL.PEN);
    }
    this.changeTool(e);
  }

  changeTool(e) {
    let current = e.target;
    while(current.dataset.type === undefined) {
      current=current.parentNode;
    }
    let type = current.dataset.type;
    let value = Number.parseInt(current.dataset.value);
    this.props.callback(type, value);
  };

  render() {
    const row1 = [];
    const row2 = [];
    let i = 0;
    //row size is 11, total 22 items
    for(;i < 11; i++){
      row1.push(this.renderColorItem(i));
    }
    for(;i < 22; i++){
      row2.push(this.renderColorItem(i));
    }

    return (
      <div className="containerToolbar" style={{visibility: this.props.show?'visible':'hidden'}}>
        <div className="colorPreview" style={{backgroundColor: this.props.color}}>
        </div>
        <div className="containerColorbox">
          <div className="containerColorColumn">
            {row1}
          </div>
          <div className="containerColorColumn">
            {row2}
          </div>
        </div>
        <div className="containerTools">
          <div className={`tool ${this.props.tool===TOOL.PEN?'toolActive':''}`} data-type='tool' data-value={TOOL.PEN} onClick={this.changeTool}>
            <img className="toolIcon" src="/pen.png"/>
          </div>
          <div className={`tool ${this.props.tool===TOOL.RUBBER?'toolActive':''}`} data-type='tool' data-value={TOOL.RUBBER} onClick={this.changeTool}>
            <img className="toolIcon" src="/rubber.png"/>
          </div>
          <div className={`tool ${this.props.tool===TOOL.FILL?'toolActive':''}`} data-type='tool' data-value={TOOL.FILL} onClick={this.changeTool}>
            <img className="toolIcon" src="/filltool.png"/>
          </div>
        </div>
        <div className="containerBrushSizes">
          <div className={`brushSize ${this.props.width==0?'toolActive':''}`} data-type='width' data-value={0} onClick={this.changeTool}>
            <div className="sizeCenter">
              <div className="size size6"/>
            </div>
          </div>
          <div className={`brushSize ${this.props.width==1?'toolActive':''}`} data-type='width' data-value={1} onClick={this.changeTool}>
            <div className="sizeCenter">
              <div className="size size16"/>
            </div>
          </div>
          <div className={`brushSize ${this.props.width==2?'toolActive':''}`} data-type='width' data-value={2} onClick={this.changeTool}>
            <div className="sizeCenter">
              <div className="size size30"/>
            </div>
          </div>
          <div className={`brushSize ${this.props.width==3?'toolActive':''}`} data-type='width' data-value={3} onClick={this.changeTool}>
            <div className="sizeCenter">
              <div className="size size44"/>
            </div>
          </div>
        </div>
        <div className="containerClearCanvas" onClick={this.props.clear}>
          <div className="buttonClearCanvas"/>
        </div>
      </div>
    )
  }
}

export default Toolbox
