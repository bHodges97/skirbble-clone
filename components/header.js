import Link from 'next/link'
import React from "react"
import Avatar from './avatar'

class Canvas extends React.Component {
  constructor(props){
    super(props)
  }

  render() {
    let rand = ()=> Math.floor(Math.random() * 13);
    let smallAvatar = (n)=>{
      let items = []
      for(let i=0; i<n; i++) {
        items.push(<Avatar key={i} scale={48} hat={rand()} face={rand()} color={rand()}/>)
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
