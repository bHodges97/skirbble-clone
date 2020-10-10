
class Toolbox extends React.Component {
  constructor(props) {
    super(props);
    this.row1 = ["#FFFFFF","#C1C1C1","#EF130B","#FF7100","#FFE400","#00CC00","#00B2FF","#231F3D","#A300BA","#D37CAA","#A0522D"];
    this.row2 = ["#000000","#4C4C4C","#740B07","#C23800","#E8A200","#005510","#00569E","#0E0865","#550069","#A75574","#63300D"];
    this.renderColorItem = this.renderColorItem.bind(this);
  }

  
  componentDidMount(){
  }

  renderColorItem(x,id){
    return (
      <div className="colorItem" style={{backgroundColor: x}} key={id}/>
    )
  }

  render() {
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
          <div className="tool">
            <img className="toolIcon" src="/pen.gif"/>
          </div>
          <div className="tool">
            <img className="toolIcon" src="/rubber.gif"/>
          </div>
          <div className="tool">
            <img className="toolIcon" src="/fillTool.gif"/>
          </div>
        </div>
        <div className="containerBrushSizes">
          <div className="brushSize">
            <div className="sizeCenter">
              <div className="size size6"/>
            </div>
          </div>
          <div className="brushSize">
            <div className="sizeCenter">
              <div className="size size16"/>
            </div>
          </div>
          <div className="brushSize">
            <div className="sizeCenter">
              <div className="size size30"/>
            </div>
          </div>
          <div className="brushSize">
            <div className="sizeCenter">
              <div className="size size44"/>
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
