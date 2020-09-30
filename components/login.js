import Link from 'next/link'
import styles from '../styles/login.module.css'

export default function Login() {
  return (
    <div className={styles.screenLogin}>
      <div className={styles.loginSideLeft}/>
      <div className={styles.loginContent}>
        <div className={styles.loginPanelContent}>
          <form>
            <div style={{"display": "flex"}}>
              <input id={styles.inputName} className={styles.formFontrol} type="text" autoComplete="off" placeholder="Enter your name" maxLength="32"/>
              <select id={styles.loginLanguage} className={styles.formControl}>
                <option>English</option>
              </select>
            </div>
            <div>
              <button className={styles.btnBlock + ' ' + styles.btn + ' ' + styles.btnSuccess} type="submit"> 
                Play!
              </button>

              <button className={styles.btnBlock + ' ' + styles.btn + ' ' + styles.btnInfo} type="submit"> 
                Create Private Room!
              </button>
            </div>
          </form>
        </div>
      </div>
      <div className={styles.loginSideRight}/>
    </div>
  )
}
