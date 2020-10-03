import Link from 'next/link'
import AvatarSelector from './avatarselector'
import Info from './info'

class ScreenLogin extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="screenLogin">

        <div className="loginSideLeft"/>

        <div className="loginContent">
          <div className="loginPanelContent" style={{"padding": "8px", "marginBottom": "4px"}}>
            <form>
              <div style={{"display": "flex"}}>
                <input id="inputName" className="formFontrol" type="text" autoComplete="off" placeholder="Enter your name" maxLength="32"/>
                <select id="loginLanguage" className="formControl">
                  <option>English</option>
                </select>
              </div>
              <AvatarSelector/>
              <div>
                <button className="btn btnBlock btnSuccess" type="submit"> 
                  Play!
                </button>

                <button className="btn btnBlock btnInfo" type="submit"> 
                  Create Private Room!
                </button>
              </div>
            </form>
          </div>

          <Info/>
    
        </div>
        <div className="loginSideRight"/>
      </div>
    )
  }
}

export default ScreenLogin
