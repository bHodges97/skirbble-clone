import Link from 'next/link'
import React from "react"

class Canvas extends React.Component {
  constructor(props){
    super(props)
  }

  render() {
  return (
    <div className="header">
      <div id="containerLogoBig" style={{"display": this.props.data=="none"?"none":""}}>
        <Link href="/">
          <a>
            <img className="logoBig" src="logo.png"/>
          </a>
        </Link>
      </div>
      <div id="containerLogoSmall" style={{"display": this.props.data=="none"?"":"none"}}>
        <div className="LogoSmallWrapper">
          <Link href="/">
            <a>
              <img className="logoSmall" src="logo.png"/>
            </a>
          </Link>
        </div>
      </div>
    </div>
  )
  }
}
export default Canvas
