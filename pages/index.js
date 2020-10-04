import Head from 'next/head'
import Link from 'next/link'
import React from "react"

import Header from 'components/header'
import ScreenLogin from 'components/screenlogin'
import Info from 'components/info'
import SocketContext from "components/socketcontext"

class Home extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      test: "waiting for message"
    }
  }

  componentDidMount(){
    this.socket = this.context
    this.socket.on('now', data =>{
      this.setState({
        test: data.message
      })
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
            <Header data="block"/>
                <ScreenLogin/>
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
