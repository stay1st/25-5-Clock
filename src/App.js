import React, { useState } from "react";
import CountDown from "./CountDown.js";
import dancer from './dancer.jpg';
import './alert.mp3';
import "./App.css";




export default function App() {

  const initialTimeSession = () => 25 * 60;
  const initialBreakLength = () => 5 * 60;
  const initialSessionLength = () => 25 * 60;

  const [timeInSession, setTimeInSession] = useState(initialTimeSession);
  const [breakLength, setBreakLength] = useState(initialBreakLength);
  const [sessionLength, setSessionLength] = useState(initialSessionLength);
  const [toggle, setToggle] = useState(false);


  const [canIHaveABreak, setCanIhaveABreak] = useState(false);
  const [audio] = useState(new Audio('./alert.mp3'));

  const appendSessionOrBreakLength = (count) => {
    const min = Math.floor(count / 60)
    return min
  }

  const appendTime = (count) => {
    const min = Math.floor(count / 60)
    const sec = count % 60
      return (min < 10 ? "0" + min : min) + ":" + (sec < 10 ? "0" + sec : sec)
  };

  const add = (prev, value) => {
    return prev + value
  };

  const changeClock = (quantity, type) => {
    console.log(breakLength, quantity, type)
    if (type === "break") {
      if (breakLength <= 60 && quantity < 0) {
        return;
      }
      setBreakLength((prev) => add(prev , quantity));
    } else {
      if (sessionLength <= 60 && quantity < 0) {
        return;
      }
      setSessionLength((prev) => add(prev, quantity))
      if(!toggle){
        setTimeInSession(sessionLength + quantity)
      }
    }
  };

  const notOnBreak = (prev, yesRightNow) => {
    if (prev <= 0 && yesRightNow === false){
      audio.play()
      yesRightNow = true
      setCanIhaveABreak(yesRightNow)
      return toggle
    } else if(prev <= 0 && yesRightNow === true) {
      setCanIhaveABreak(false)
      return breakLength
    }
    return prev -1
  };

  const playPauseTimer = () => {

    let prevDate = new Date().getTime()
    let nextDate = new Date().getTime() + 1000
    let yesRightNow = canIHaveABreak

    if (!toggle){
      console.log(toggle)
      const interval = setInterval(() => {
        prevDate = new Date().getTime()
          if (prevDate > nextDate) {
            setTimeInSession((prev) => notOnBreak(prev, yesRightNow))
          let oneSecondFoward = add(nextDate, 1000)
          nextDate = oneSecondFoward
        }
      }, 30);

      localStorage.clear()
      localStorage.setItem('int', interval)
    };
    if(toggle){
      clearInterval(localStorage.getItem('int'))
    }
    setToggle(!toggle);
  };

  const resetState = () => {
    playPauseTimer()
    setTimeInSession(initialTimeSession)
    setBreakLength(initialBreakLength)
    setSessionLength(initialSessionLength)
  };

  return (
    <>
    <div>
      <img 
        src={dancer} 
        alt="dancer-background-black" 
        id="dancerImage"
        />
    </div>
    <div className="flex-container">
      <div id="Break">
        <CountDown
          h3label={'break-label'} //User Story #1
          title={"Break Length"} //User Story #1
          decrement={'break-decrement'} //User Story #3
          increment={'break-increment'} //User Story #4
          lengthCounter={'break-length'} // User Story #5
          changeClock={changeClock}
          type={"break"}
          count={breakLength}
          appendSeshOrBreak={appendSessionOrBreakLength}
        />
      </div>
      <div>
        <h3 id="timer-label">{!toggle ? 'Break' : 'Session'}</h3>
        <audio src={audio} />
      </div>
      <div id="heading2">
        <h2 id="time-left" className="timer">{appendTime(timeInSession)}</h2>
      </div>
      <div id="session">
        <CountDown
          h3label={'session-label'} // User Story #2
          title={"Session Length"} // User Story #2
          decrement={'session-decrement'} // User Story #3
          increment={'session-increment'} // User Story #4
          lengthCounter={'session-length'} // User Story #5
          changeClock={changeClock}
          type={"session"}
          count={sessionLength}
          appendSeshOrBreak={appendSessionOrBreakLength}
        />
      </div>
      <div id="play-refresh">
      <button id='start_stop' onClick={playPauseTimer}>
        <i className="fa-solid fa-play"></i>
      </button>
      <button id="reset" onClick={resetState}>
        <i className="fa fa-arrows-rotate"></i>
      </button>
      </div>
    </div>
    </>
  )
};
