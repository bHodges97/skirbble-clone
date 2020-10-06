import SocketContext from "./socketcontext"

class ChatArea extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.submit = this.submit.bind(this);

    this.state = {
      messages: [],
      input: "",
    };
  }

  
  componentDidMount(){
    this.socket = this.context
    this.socket.on('message', (data)=>{
      console.log(data);
      this.setState({
        messages: [...this.state.messages, data],
      })
    });
  }

  handleChange(event) {
    this.setState({input: event.target.value});  
  }
  
  submit(e){
    if(e.keyCode == 13 && e.shiftKey == false) {
      e.preventDefault();
      this.context.emit('message', this.state.input);
      this.setState({input: ""});  
    }
  }


  render() {
    return (
      <div id="containerChat">
        <div id="boxChat">
          <div id="boxMessages">
            {this.state.messages.map((data,index)=>{
              return (
                <div key={index} style={{color: data.color}}> 
                  {data.name?
                    <>
                    <b>{data.name}: </b>
                    <span>{data.content}</span>
                    </>
                    :
                    <b>{data.content}</b>
                  }
                </div>
              )
            })}
          </div>
          <div id="boxChatInput">
            <form id="formChat">
              <input id="inputChat" className="formControl" autoComplete="off" type="text" placeholder="Type your guess here..." maxLength="100" value={this.state.input} onChange={this.handleChange} onKeyDown={this.submit}/>
            </form>
          </div>
        </div>
      </div>
    )
  }
}
ChatArea.contextType = SocketContext;

export default ChatArea
