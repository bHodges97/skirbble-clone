import Link from 'next/link'

export default function Header() {
  return (
    <div className="header">
      <div className="containerLogoBig">
        <Link href="/">
          <a>
            <img className="logoBig" src="logo.gif"/>
          </a>
        </Link>
      </div>
    </div>
  )
}
