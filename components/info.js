import React from "react"

class Info extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this); 
  }

  handleClick(e) {
    this.setState(state => ({}));  
    const ctx = e.target.getContext('2d');
  }

  render() {
    function showHide(e) {
      e.preventDefault();
      /* Toggle between hiding and showing the active panel */
      let panel = e.target.parentNode.parentNode.nextElementSibling;
      if (panel.style.display === "block") {
        panel.style.display = "none";
      } else {
        panel.style.display = "block";
      }
    }

    return (
    <div className="loginPanelContent">
      <div id="accordion" className="panelGroup informationTabs" style={{"magin":"0","padding":"8px"}} aria-multiselectable="true">
        <div id="tabUpdate" role="tab">
          <h3>
          <a role="button" onClick={showHide} href="#collapseUpdate" aria-expanded="true" aria-controls="collapseUpdate">News</a>
          </h3>
        </div>
        <div id="collapseUpdate" className="updateInfo collapse in" role="tabpanel" aria-labelledby="tabUpdate" aria-expanded="true">
          Hello!

          This is a clone of skribbl.io!
          <p>
          There is no animation for this accordian since i'm not using the bootstrap library. Something to consider later?
          </p>
        </div>
        <div id="tabAbout" role="tab">
          <h3>
            <a role="button" onClick={showHide} href="#collapseAbout" aria-expanded="false" aria-controls="collapseAbout" className="collapsed">About</a>
          </h3>
        </div>
        <div id="collapseAbout" style={{"display": "none"}} className="panel-collapse collapse in" role="tabpanel" aria-labelledby="tabUpdate" aria-expanded="true">
          <b>skribbl.io </b>is a free multiplayer drawing and guessing game.<br/>
          One game consists of a few rounds in which every round
          someone has to draw their chosen word and others have to guess it to gain points!<br/>
          The person with the most points at the end of game will then be crowned as the winner!
        </div>

        <div id="tabHow" role="tab">
          <h3>
            <a class="collapsed" onClick={showHide} role="button" href="#collapseHow" aria-expanded="false" aria-controls="collapseHow">
              How to Play
            </a>
          </h3>
        </div>
        <div id="collapseHow" style={{"display": "none"}} className="panel-collapse collapse in" role="tabpanel" aria-labelledby="tabUpdate" aria-expanded="true">
          When its your turn to draw, you will have to choose a word from three options
          and visualize that word in 80 seconds, alternatively when somebody else is drawing
          you have to type your guess into the chat to gain points, be quick,
          the earlier you guess a word the more points you get!
        </div>
      </div>
    </div>
  )
  }
}

export default Info
