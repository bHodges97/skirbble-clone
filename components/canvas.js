import React from "react"

class Canvas extends React.Component {
  constructor(props) {
    super(props);
    //this.handleClick = this.handleClick.bind(this);  }
  }

  handleClick() {
    this.setState(state => ({}));  
  }
  render() {
    return (
      <canvas class="doodleArea" width="100" height="100" onClick={this.handleClick}>
      </canvas>
    );
  }
}

export default Canvas

