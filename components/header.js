import Link from 'next/link'
import React from "react"
import Avatar from './avatar'

class Canvas extends React.Component {
  constructor(props){
    super(props)
    this.count = 8;
    //disguting work around because nextjs gives errors if you give components random values initialy
    this.state = {
      hat: Array(this.count).fill(0),
      color: Array(this.count).fill(0),
      face: Array(this.count).fill(0),
    }
  }

  rand() {
    return Math.floor(Math.random() * 13);
  }

  componentDidMount() {
    this.setState({
      hat: this.state.hat.map(this.rand),
      color: this.state.color.map(this.rand),
      face: this.state.face.map(this.rand),
    });
  }

  render() {
    let smallAvatar = (n)=>{
      const items = []
      for(let i=0; i<n; i++) {
        items.push(<Avatar key={i} scale={48} hat={this.state.hat[i]} face={this.state.face[i]} color={this.state.color[i]}/>)
      }
      return items
    };
    return (
      <div className="header">
        {this.props.data!="none"?
        <div id="containerLogoBig">
          <a href="/">
            <img className="logoBig" src="logo.png"/>
            <div className="logoAvatarContainer">
              {smallAvatar(8)}
            </div>
          </a>
        </div>
        :
        <div id="containerLogoSmall">
          <div className="LogoSmallWrapper">
              <a href="/">
                <img className="logoSmall" src="logo.png"/>
              </a>
          </div>
        </div>
        }
      </div>
    )
  }
}
export default Canvas
