import Head from 'next/head'
import Link from 'next/link'
import Header from '../components/header'
import Login from '../components/login'
import Info from '../components/info'

export default function Home() {
  return (
    <div className="container">
      <Head>
        <title>skribble-clone</title>
        <link rel="icon" href="/favicon.png" />
      </Head>

      <main>
        <div className="container-fluid" style={{'max-width':"1400px", 'padding': "0px 4px 0px 4px"}}>
          <Header/>
          <div className="screenLogin">
            <div className="loginSideLeft"/>
            <div className="loginContent">
              <Login/>
              <Info/>
            </div>
            <div className="loginSideRight"/>
          </div>
        </div>
      </main>

      <footer>
      </footer>
    </div>
  )
}
