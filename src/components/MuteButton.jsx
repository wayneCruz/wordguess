import muteIcon from "../assets/mute.png"
import volumeIcon from "../assets/volume.png"

export default function MuteButton(props) {
  return <button 
    className="mute-button"
    onClick={props.muteClick}
    > <img src={props.muted ? muteIcon 
        : volumeIcon}/>
    </button>
}