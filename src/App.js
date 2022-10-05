import React, { useState } from "react";
import CountDown from "./CountDown.js";
import dancer from './dancer.jpg';
import './alert.mp3';
import "./App.css";




export default function App() {

  const initialTimeSession = () => 25 * 60;
  const initialBreakTime = () => 5 * 60;
  const initialTimer = () => 25 * 60;

  const [timeInSession, setTimeInSession] = useState(initialTimeSession);
  const [breakTime, setBreakTime] = useState(initialBreakTime);
  const [timer, setTimer] = useState(initialTimer);
  const [toggle, setToggle] = useState(false);


  const [canIHaveABreak, setCanIhaveABreak] = useState(false);
  const audio = new Audio('./alert.mp3');

  const appendTime = (count) => {
    const min = Math.floor(count / 60)
    const sec = count % 60
      return (min < 10 ? "0" + min : min) + ":" + (sec < 10 ? "0" + sec : sec)
  };

  const add = (value, type) => {
    return value + type
  };

  const changeClock = (quantity, type) => {
    if (type === "break") {
      if (breakTime <= 60 && quantity < 0) {
        return
      }
      setBreakTime((prev) => add(prev, quantity));
    } else {
      if (timer <= 60 && quantity < 0) {
        return
      }
      setTimer((prev) => add(prev, quantity))
      if(!toggle){
        setTimeInSession(timer + quantity)
      }
    }
  };

  const notOnBreak = (prev, yesRightNow) => {
    if (prev <= 0 && !yesRightNow){
      audio.duration = 0
      audio.play()
      yesRightNow = true
      setCanIhaveABreak(yesRightNow)
      return toggle
    } else if(prev <= 0 && yesRightNow === true) {
      let notRightNow = false
      yesRightNow = notRightNow
      setCanIhaveABreak(notRightNow)
      return breakTime
    }
    return prev -1
  };

  const playPauseTimer = () => {

    let prevDate = new Date().getTime()
    let nextDate = new Date().getTime() + 1000
    let yesRightNow = canIHaveABreak

    if (!toggle){
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
    setTimeInSession(initialTimeSession)
    setBreakTime(initialBreakTime)
    setTimer(initialTimer)
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
          id={'break-label'}
          title={"Break Length"}
          changeClock={changeClock}
          type={"break"}
          count={breakTime}
          appendTime={appendTime}
        />
      </div>
      <div>
        <h3>{canIHaveABreak ? 'onBreak' : 'inSession'}</h3>
      </div>
      <div id="heading2">
        <h2 className="timer">{appendTime(timeInSession)}</h2>
      </div>
      <div id="session">
        <CountDown
          id={'session-label'}
          title={"Session Length"}
          changeClock={changeClock}
          type={"session"}
          count={timeInSession}
          appendTime={appendTime}
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
