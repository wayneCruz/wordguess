import "../styles/navbar.css"
import MuteButton from "./MuteButton"
import settingsIcon from "../assets/settings-icon.svg"

export default function Navbar(props) {
  return <nav 
      className="nav-bar-container">
    <button className="settings-button">
      <img onClick={props.settingsClick}
        src={settingsIcon} 
        alt="settings icon"/>
    </button>

    <MuteButton 
      muteClick={props.muteClick}
      muted={props.muted}
    />
  </nav>
}