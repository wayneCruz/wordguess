import "../styles/menu.css"
import Footer from "./Footer"
import { useEffect, useRef } from "react"
import MuteButton from "./MuteButton"
import victorySound from "../assets/music/victory-music.mp3"
import gameOverSound from "../assets/music/gameover.mp3"
import victoryBg from "../assets/avengers/avengers-won.jpg"
import gameOverBg from "../assets/avengers/thanos-won.jpg"
import avengersBg from "../assets/avengers/avengers-background.jpg"
import appIcon from "../assets/wordguess-icon.png";

export default function Menu(props) {
  //localstorage value for high score
  const highScore = JSON.parse(localStorage.getItem("high-score")) || "0"

  const formatedTime = props.formatedTime
  const soundRef = useRef()

  //derived values
  const avengersLeft = props.avengersLeft
  const time = props.time
  let score = 0;

  if(props.win) {
    score = (avengersLeft * 100) + ((time) * 54.61)
  }

  //useEffects
  //sound effect when game is over either win or lose
  useEffect(() => {
    if(props.isOver) {
      soundRef.current.volume = 0.7
      soundRef.current.play()
    }
  }, [props.isOver])

  useEffect(()=> {
    soundRef.current.muted = props.muted ? true : false
  }, [props.muted])

  useEffect(() => {
    if(score > highScore){
      localStorage.setItem("high-score", JSON.stringify(score))
    }
  }, [score])

  return <div className="menu-container">
    <div className="menu-overlay"></div>
    <div className="menu">
      <header className="menu-header">
        <div>High Score: <strong>{Math.floor(highScore)}</strong></div>
      </header>

      {props.isPlaying && 
      <div className="mute-button-container">
        <MuteButton 
            muteClick={props.muteClick}
            muted={props.muted}
        />
      </div>}

      <img className="game-logo" 
        src={appIcon}
      />

      {/*bg audio when game is over */}
      <audio ref={soundRef}>
        {!props.muted ? <source src={props.win ? victorySound : gameOverSound}/> : null}
      </audio>

      {props.isOver ? 
        <div className="result-background-image">
          {props.win && <img src={victoryBg} />
          }
          {props.lost && <img src={gameOverBg} />}
        </div> 
          : 
        <div className="result-background-image">
          <img src={avengersBg} />
        </div>
      }
      
      <div className="title-container">
        <h1>Word Guess: Endgame!</h1>
      </div>

      {!props.isPlaying ? <div className="game-description-intro">
          <p>Help the Avengers! Guess the universe in under
            <strong> 8 attempts</strong> in <strong>2 minutes </strong> 
            to keep the world safe from the Mad Titan Thanos!</p>
      </div> : null}

      {props.win ? <section className="game-status win">
        <h2>Correct!</h2>
        <p className="correct-word-p">The word is <strong>"{props.word.toUpperCase()}"</strong></p>
        <div className="score-container">
          <strong>Result:</strong>
          <p>Time Remaining: <strong>{formatedTime}</strong></p>
          <p>Avengers Left: <strong>{avengersLeft}</strong></p>
          <p>{score + 54.61 >= highScore ? 'New High Score:' : 'Your Score:'} <strong>{Math.floor(score + 54.61)}</strong></p>
        </div>
      </section> : null}

      {props.lost ? <section className="game-status lost">
        {time <= 1 ? <h2>Time is up!</h2> : <h2>Game Over!</h2>}
        
        <h3>The word is <strong>"{props.word.toUpperCase()}"</strong></h3>
        <p> You lose! Thanos killed half of the universe population!</p>
      </section> : null}

      <button 
            className="button-play"
            onClick={() => {
            props.new()
            props.toggleAudio()
          }
        }>
        {props.isPlaying ? "New Game" : "Play"}
      </button>

      { props.isPlaying && !props.isOver ? 
      <button 
        className="button-play"
        onClick={() => {
        props.toggleNav()
        props.toggleTime()
      }}>
        Resume
      </button>: null}

      <Footer />
    </div>
  </div>
}