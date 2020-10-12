
class Toolbox extends React.Component {
  constructor(props) {
    super(props);
    this.row1 = ["#FFFFFF","#C1C1C1","#EF130B","#FF7100","#FFE400","#00CC00","#00B2FF","#231FD3","#A300BA","#D37CAA","#A0522D"];
    this.row2 = ["#000000","#4C4C4C","#740B07","#C23800","#E8A200","#005510","#00569E","#0E0865","#550069","#A75574","#63300D"];
    this.renderColorItem = this.renderColorItem.bind(this);
    this.state = {tool: 'pen',width: 6};
  }

  
  componentDidMount(){
  }

  renderColorItem(x,id){
    return (
      <div className="colorItem" style={{backgroundColor: x}} key={id} data-type='color' data-value={x} onClick={this.props.callback}/>
    )
  }

  render() {
    const changeTool = (e)=>{
      this.setState({[e.target.dataset.type]: e.target.dataset.value});
    };

    return (
      <div className="containerToolbar">
        <div className="colorPreview">
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
          <div className={`tool ${this.state.tool==='pen'?'toolActive':''}`}>
            <img className="toolIcon" src="/pen.png" data-type='tool' data-value="pen" onClick={changeTool}/>
          </div>
          <div className={`tool ${this.state.tool==='rubber'?'toolActive':''}`}>
            <img className="toolIcon" src="/rubber.png" data-type='tool' data-value="rubber" onClick={changeTool}/>
          </div>
          <div className={`tool ${this.state.tool==='fill'?'toolActive':''}`}>
            <img className="toolIcon" src="/filltool.png" data-type='tool' data-value="fill" onClick={changeTool}/>
          </div>
        </div>
        <div className="containerBrushSizes">
          <div className={`brushSize ${this.state.width==6?'toolActive':''}`}>
            <div className="sizeCenter">
              <div className="size size6" data-type='width' data-value={6} onClick={changeTool}/>
            </div>
          </div>
          <div className={`brushSize ${this.state.width==16?'toolActive':''}`}>
            <div className="sizeCenter">
              <div className="size size16" data-type='width' data-value={16} onClick={changeTool}/>
            </div>
          </div>
          <div className={`brushSize ${this.state.width==30?'toolActive':''}`}>
            <div className="sizeCenter">
              <div className="size size30" data-type='width' data-value={30} onClick={changeTool}/>
            </div>
          </div>
          <div className={`brushSize ${this.state.width==44?'toolActive':''}`}>
            <div className="sizeCenter">
              <div className="size size44" data-type='width' data-value={44} onClick={changeTool}/>
            </div>
          </div>
        </div>
        <div className="containerClearCanvas">
          <div className="buttonClearCanvas"/>
        </div>
      </div>
    )
  }
}

export default Toolbox
