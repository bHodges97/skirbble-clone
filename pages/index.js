import Head from 'next/head'
import Link from 'next/link'
import React from "react"

import Header from '../components/header'
import Login from '../components/login'
import Info from '../components/info'
import io from "socket.io-client"

class Home extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      test: "waiting for message"
    }
  }

  componentDidMount(){
    this.socket = io()
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
            <Header/>
            <div className="screenLogin">
              <div className="loginSideLeft"/>
              <div className="loginContent">
                <Login/>
                <Info/>
              </div>
              <div className="loginSideRight"/>
            </div>
            <div>
              <h1>{this.state.test}</h1>
            </div>
          </div>
        </main>

        <footer>
        </footer>
      </div>
    )
  }
}
export default Home
