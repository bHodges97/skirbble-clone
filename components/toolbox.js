
class Toolbox extends React.Component {
  constructor(props) {
    super(props);
    this.row1 = ["#FFFFFF","#C1C1C1","#EF130B","#FF7100","#FFE400","#00CC00","#00B2FF","#231FD3","#A300BA","#D37CAA","#A0522D"];
    this.row2 = ["#000000","#4C4C4C","#740B07","#C23800","#E8A200","#005510","#00569E","#0E0865","#550069","#A75574","#63300D"];
    this.renderColorItem = this.renderColorItem.bind(this);
    this.state = {tool: 'pen',width: 6,color: '#000000'};
    this.changeTool = this.changeTool.bind(this);
  }

  
  componentDidMount(){
  }

  renderColorItem(x,id){
    return (
      <div className="colorItem" style={{backgroundColor: x}} key={id} data-type='color' data-value={x} onClick={this.changeTool}/>
    )
  }

  changeTool(e){
    let current = e.target;
    while(current.dataset.type == undefined)current=current.parentNode;
    this.setState({[current.dataset.type]: current.dataset.value});
    this.props.callback(current);
  };

  render() {

    return (
      <div className="containerToolbar">
        <div className="colorPreview" style={{backgroundColor: this.state.color}}>
        </div>
        <div className="containerColorbox">
          <div className="containerColorColumn">
            {this.row1.map(this.renderColorItem)}
          </div>
          <div className="containerColorColumn">
            {this.row2.map(this.renderColorItem)}
          </div>
        </div>
        <div className="containerTools">
          <div className={`tool ${this.state.tool==='pen'?'toolActive':''}`} data-type='tool' data-value="pen" onClick={this.changeTool}>
            <img className="toolIcon" src="/pen.png"/>
          </div>
          <div className={`tool ${this.state.tool==='rubber'?'toolActive':''}`} data-type='tool' data-value="rubber" onClick={this.changeTool}>
            <img className="toolIcon" src="/rubber.png"/>
          </div>
          <div className={`tool ${this.state.tool==='fill'?'toolActive':''}`} data-type='tool' data-value="fill" onClick={this.changeTool}>
            <img className="toolIcon" src="/filltool.png"/>
          </div>
        </div>
        <div className="containerBrushSizes">
          <div className={`brushSize ${this.state.width==6?'toolActive':''}`} data-type='width' data-value={6} onClick={this.changeTool}>
            <div className="sizeCenter">
              <div className="size size6"/>
            </div>
          </div>
          <div className={`brushSize ${this.state.width==16?'toolActive':''}`} data-type='width' data-value={16} onClick={this.changeTool}>
            <div className="sizeCenter">
              <div className="size size16"/>
            </div>
          </div>
          <div className={`brushSize ${this.state.width==30?'toolActive':''}`} data-type='width' data-value={30} onClick={this.changeTool}>
            <div className="sizeCenter">
              <div className="size size30"/>
            </div>
          </div>
          <div className={`brushSize ${this.state.width==44?'toolActive':''}`} data-type='width' data-value={44} onClick={this.changeTool}>
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
