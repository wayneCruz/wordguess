import "../styles/navbar.css"
import MuteButton from "./MuteButton"

export default function Navbar(props) {
  return <nav 
      className="nav-bar-container">
    <button className="settings-button">
      <img onClick={props.settingsClick}
        src="/src/assets/settings-icon.svg" 
        alt="settings icon"/>
    </button>

    <MuteButton 
      muteClick={props.muteClick}
      muted={props.muted}
    />
  </nav>
}