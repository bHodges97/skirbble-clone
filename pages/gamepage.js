import Head from 'next/head'
import Link from 'next/link'
import React from "react"

import Header from 'components/header'
import ScreenGame from 'components/screengame'
import Info from 'components/info'
import io from "socket.io-client"
import Canvas from 'components/canvas'


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
          <Canvas/>
          </div>
        </main>

        <footer>
        </footer>
      </div>
    )
  }
}
export default Game
