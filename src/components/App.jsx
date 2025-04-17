import { useEffect, useState, useRef } from "react"
import "../styles/app.css"
import { avengers } from "../data/avengers.js"
import { nanoid } from 'nanoid'
import { clsx } from 'clsx'
import { getRandomWord } from "../utils/utils.js"
import Confetti from 'react-confetti'
import Menu from "./Menu.jsx"
import Navbar from "./Navbar.jsx"
import bgMusicFile from "../assets/music/background-music.mp3"
import correctSound from "../assets/music/correctSound.mp3"
import wrongSound from "../assets/music/wrongSound.mp3"
import backgroundPhoto from "../assets/avengers/avengers-vs-thanos.webp"


export default function AssemblyEndgame() {
    //state values
    const [currentWord, setCurrentWord] = useState(getRandomWord)
    const [guessedLetters, setGuessedLetters] = useState([])
    const [menuShown, setMenuShown] = useState(true) //state for showing the menu
    const [isPlaying, setIsPlaying] = useState(false)
    const [count, setCount] = useState(120) //120 seconds for initial time remaining
    const [isCounting, setIsCounting] = useState(false)
    const [mute, setMute] = useState(false) 
    const [currentGuess, setCurrentGuess] = useState(1) //state for sounds
    
    const audioRef = useRef()
    const timerId = useRef()

    // console.log(currentWord)

    //useEffects
    useEffect(() => {
      if(isCounting){
        timerId.current = setInterval(() => {
          setCount(prev => prev - 1)
        }, 1000)
      }
      
      return () => clearInterval(timerId.current)

    }, [isCounting])

    //stops time if count reaches 0
    useEffect(() => {
      if(count <= 0){
        clearInterval(timerId.current)
        setIsCounting(false)
      }

      if(isGameOver) {
        stopTime()
      }
    }, [count])

    //disable the sound for autoplaying when the first load of page
    useEffect(() => {
      if(currentGuess % 2 === 0){
        soundClick()
      }
    }, [currentGuess])

    //disable/mute the music
    useEffect(()=> {
      audioRef.current.muted = mute ? true : false
    }, [mute])

    //derived valued
    const wrongGuessesCount = guessedLetters.filter(letter =>
      !currentWord.includes(letter)).length

    const isGameWin = currentWord.split("").every(letter => guessedLetters.includes(letter));
    const isGameLost = wrongGuessesCount >= avengers.length - 1 || count <= 0
    const isGameOver = isGameWin || isGameLost 
    const isLastIncorrect = guessedLetters.length && !currentWord.includes(guessedLetters[guessedLetters.length - 1])
        
    //static values
    const alphabet = "abcdefghijklmnopqrstuvwxyz"

    //show the element depends if the guessedletter match the currenword
    const letterElements = currentWord.split("").map(letter => {
      const shouldReveal = isGameOver || guessedLetters.includes(letter)
      const letterClass = clsx({
          missedLetters: !guessedLetters.includes(letter),
          letterGuess: true
        }
      )
      
      return <span 
            className={letterClass}
            key={nanoid()}
          >{shouldReveal ? letter.toUpperCase() : ''}
        </span>
      }
    )

    //displays the avengers images. if avenger index < wrongguestcount add the 'lost' class
    const avengersList = avengers.map((av, index) => {
      const lostAv = index < wrongGuessesCount

      const className = clsx({
        avenger: true, 
        lost: lostAv
      })

      return <span style={{
            backgroundColor: av.backgroundColor,
            color: av.color
          }} 
          className={className}
          key={av.name}>
          <img src={av.image} alt={av.name}/>
        </span>
      }
    )

    //add a letter depends if the guessletter has it
    function addGuessedLetters(letter) {
        setGuessedLetters(prev => 
          prev.includes(letter) ? prev : [...prev, letter]
        )
      } 

      const keyboardButtons = alphabet.split("").map(letter => {
        const isGuessed = guessedLetters.includes(letter)
        const isCorrect = isGuessed && currentWord.includes(letter)
        const isWrong = isGuessed && !currentWord.includes(letter)

        const className = clsx({
          correct: isCorrect,
          wrong: isWrong,
          buttonkey: true
        })
    
        return <button key={letter}
          className={className}
          disabled={isGameOver}
          aria-disabled={guessedLetters.includes(letter)}
          aria-label={`Letter ${letter}`}
          onClick={() => {
            setCurrentGuess(currentGuess + 1)
            addGuessedLetters(letter)
          }}>
          {letter.toUpperCase()}
        </button>
      }
    )

    const statusClassName = clsx({
      status: true,
      statusHide: true,
      statusWon: isGameWin,
      statusLost: isGameLost,
      farewellMessage: isLastIncorrect && !isGameOver
    })
    
    //render the status when an avenger have been defeated
    function renderGameStatus() {
      if(isLastIncorrect && !isGameOver) {
        return  <span className={statusClassName}>
            <p>Goodbye, <strong>{avengers[wrongGuessesCount - 1].name}!</strong></p>
            <div className="lost-avenger-container">
              <img src={avengers[wrongGuessesCount - 1].image} />
            </div>
          </span>
      }else{
        return null
      }
    }

    //play wrong or correct sounds when clicking the buttons
    function soundClick() {
      let correctSoundP =  new Audio(correctSound)
      let wrongSoundP =  new Audio(wrongSound)

      correctSoundP.volume = 0.5
      wrongSoundP.volume = 0.5

      if(isLastIncorrect && !isGameOver && !mute) {
        wrongSoundP.play()
      }else if(!isLastIncorrect && !isGameOver && !mute) {
        correctSoundP.play()
      }
    }

    //plays the background music
    function playAudio() {
      audioRef.current.volume = 0.25;
      audioRef.current.loop = true;
      audioRef.current.play()
    }

    //mute music and sounds
    function muteAudio() {
      setMute(prev => !prev)
    }

    //play a new game, resets timer and render a new word to guess
    function newGame() {
      setCount(120)
      setCurrentWord(getRandomWord)
      setGuessedLetters([])
      setMenuShown(false)
      setIsPlaying(true)
      setIsCounting(true)
    }

    //toggling the nav bar
    function navBarShow() {
      setMenuShown(prev => !prev)
      stopTime()
    }

    //stops the timer
    function stopTime() {
      setIsCounting(false)
      clearInterval(timerId.current)
      setCount(prev => prev)
    }

    //format for the timer
    function formatTime(time) {
      let minutes = Math.floor(time / 60)
      let seconds = Math.floor(time - minutes * 60)
    
      if(minutes <= 10) minutes = "0" + minutes
      if(seconds <= 10) seconds = "0" + seconds
      return minutes + ":" + seconds
    }

    const timerClass = clsx({
      timer: true,
      ['orange-timer span']: count <= 30,
      ['timer-zero']: count <= 0
    })

    return (<>
            <main>
          <Navbar settingsClick={() => navBarShow()}
                  muteClick={() => muteAudio()}  
                  muted={mute}
          />

          {/*background audio */}
          <audio ref={audioRef}>
            <source src={bgMusicFile}/>
          </audio>
          
          <p className={timerClass}>Time: <span>{formatTime(count)}</span></p>
          <div className="background-overlay">
            <img src={backgroundPhoto} alt="background photo"/>
          </div>

          {menuShown || isGameOver ? 
            <Menu toggleNav={() => navBarShow()}
                  toggleTime={()=> setIsCounting(prev => !prev)}
                  new={() => newGame()}
                  isPlaying={isPlaying}
                  isOver={isGameOver}
                  lost={isGameLost}
                  win={isGameWin}
                  word={currentWord}
                  time={count + 1}
                  formatedTime={formatTime(count)}
                  avengersLeft={(avengers.length - 1) - wrongGuessesCount}
                  toggleAudio={playAudio}
                  muteClick={() => muteAudio()}  
                  muted={mute}
            /> 
          : null}
          {isGameWin && 
            <Confetti 
              style={{zIndex: "100"}}
              recycle={false}
              numberOfPieces={500}
            />}
          <header>
            <div>
              <h2>Word Guess: Endgame!</h2>
            </div>
            <p>Help the Avengers! Guess the universe in under <strong>8 attempts</strong> in <strong>2 minutes</strong> to keep the world safe from the Mad Titan Thanos!</p>
          </header>

          <section 
            aria-live="polite"
            role="status"  
            className={statusClassName}
          >
            {renderGameStatus()}
          </section>

          <ul className='avengers'>
            {avengersList}
          </ul>

          <section className='word-section'>
            {letterElements}
          </section>

          {/*Combined visually hidden aria-live for status updates*/}
          <section 
            className='sr-only'
            aria-live="polite"
            role="status"
          >
            <p>Current Word: {currentWord.split("").map(letter =>
              guessedLetters.includes(letter) ? letter + "." : "blank"
            ).join(" ")}</p>
          </section>

          <section className='keyboard'>
            {keyboardButtons}
          </section>
        </main>
    </>
    )
}