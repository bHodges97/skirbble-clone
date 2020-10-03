import Link from 'next/link'
import React from "react"

class Canvas extends React.Component {
  constructor(props){
    super(props)
  }

  render() {
  return (
    <div className="header">
      {this.props.data!="none"?
      <div id="containerLogoBig">
        <Link href="/">
          <a>
            <img className="logoBig" src="logo.png"/>
          </a>
        </Link>
      </div>
      :
      <div id="containerLogoSmall">
        <div className="LogoSmallWrapper">
          <Link href="/">
            <a>
              <img className="logoSmall" src="logo.png"/>
            </a>
          </Link>
        </div>
      </div>
      }
    </div>
  )
  }
}
export default Canvas
