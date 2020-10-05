import Head from 'next/head'
import Link from 'next/link'
import React from "react"

import Header from 'components/header'
import ScreenLogin from 'components/screenlogin'
import ScreenGame from 'components/screengame'
import Info from 'components/info'
import SocketContext from "components/socketcontext"

class Home extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      test: "waiting for message",
      gameState: 'lobby',
    }
  }

  componentDidMount(){
    this.socket = this.context
    this.socket.on('now', data =>{
      this.setState({
        test: data.message
      })
    })
    this.socket.on('connected', ()=>{
      this.setState({gameState: 'playing'})
      console.log("connected")
      window.scrollTo(0,0)
    })
  }

  render(){
    return (
      <div className="container">
        <Head>
          <title>skribble-clone</title>
          <link rel="icon" href="/favicon.png" />
        </Head>

        <main>
          <div className="container-fluid" style={{'maxWidth':"1400px", 'padding': "0px 4px 0px 4px"}}>
            <Header data={this.state.gameState=='lobby'?"block":"none"}/>
            {this.state.gameState=='lobby'?
              <ScreenLogin/>
              :
              <ScreenGame/>
            }
            <div>
              <h1>{this.state.test}</h1>
              <Link href="/gamepage"><a>game menu test</a></Link> 
            </div>
          </div>
        </main>

        <footer>
        </footer>
      </div>
    )
  }
}
Home.contextType = SocketContext;
export default Home
