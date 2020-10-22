import Link from 'next/link'
import AvatarSelector from './avatarselector'
import Info from './info'
import SocketContext from "./socketcontext"

class ScreenLogin extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      hat: 0,
      face: 0,
      color: 0,
    };
    this.joinGame = this.joinGame.bind(this);
    this.updateAvatar = this.updateAvatar.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  joinGame(e){
    e.preventDefault();
    this.socket = this.context
    this.socket.emit('join', {
      name: this.state.name,
      hat: this.state.hat,
      face: this.state.face,
      color: this.state.color,
    })
    console.log("Connecting")
  }

  updateAvatar(key, val){
    this.setState({[key]: val})
  }


  handleChange(event) {
    this.setState({name: event.target.value});  
  }

  render() {
    return (
      <div className="screenLogin">

        <div className="loginSideLeft"/>

        <div className="loginContent">
          <div className="loginPanelContent" style={{"padding": "8px", "marginBottom": "4px"}}>
            <form onSubmit={this.joinGame}>
              <div style={{"display": "flex"}}>
                <input id="inputName" className="formControl" type="text" autoComplete="off" placeholder="Enter your name" maxLength="32" value={this.state.name} onChange={this.handleChange}/>
                <select id="loginLanguage" className="formControl">
                  <option>English</option>
                </select>
              </div>
              <AvatarSelector update={this.updateAvatar}/>
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

ScreenLogin.contextType = SocketContext;

export default ScreenLogin
