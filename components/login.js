import Link from 'next/link'

export default function Login() {
return (
      <div className="loginPanelContent">
        <form>
          <div style={{"display": "flex"}}>
            <input id="inputName" className="formFontrol" type="text" autoComplete="off" placeholder="Enter your name" maxLength="32"/>
            <select id="loginLanguage" className="formControl">
              <option>English</option>
            </select>
          </div>
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
  )
}
