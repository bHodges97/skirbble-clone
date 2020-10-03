import Canvas from 'components/canvas'
import Head from 'next/head'
import Link from 'next/link'
import React from "react"

import Header from 'components/header'
import Login from 'components/login'
import Info from 'components/info'
import io from "socket.io-client"


class Game extends React.Component {
  constructor(props){
    super(props);
  }

  componentDidMount(){
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
            <Header data="none"/>
            <Login/>
          </div>
        </main>

        <footer>
        </footer>
      </div>
    )
  }
}
export default Game
