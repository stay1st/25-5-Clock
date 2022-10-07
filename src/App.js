import React, { useCallback, useState } from "react";
import CountDown from "./CountDown.js";
import dancer from './dancer.jpg';
import audioBeep from './alert.mp3';
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
  const [timeLabel, setTimeLabel] = useState(false);

  const add = (prev, value) => {
    return prev + value
  };

  const appendTime = useCallback((count) => {
    //console.log('appendTime:', count);
    const min = Math.floor(count / 60)
    const sec = count % 60
      return (min < 10 ? "0" + min : min) + ":" + (sec < 10 ? "0" + sec : sec)
  }, [timeInSession, sessionLength]);

  const changeClock = (quantity, type) => {
    //console.log('changeClock', breakLength, quantity, type)
    if (type === "break") {
      if (breakLength <= 60 && quantity < 0) {
        //console.log('changeClock => breakLength', breakLength)
        return;
      } else if (breakLength === 3600 && quantity > 0) {
        return;
      }
      setBreakLength((prev) => add(prev , quantity));
    } else if (type === 'session'){
      if (sessionLength <= 60 && quantity < 0) {
        return;
      } else if (sessionLength === 3600 && quantity > 0) {
        return;
      }
      setSessionLength((prev) => add(prev, quantity))
      if(!toggle){
        setTimeInSession(sessionLength + quantity)
      }
    }
  };

  const appendSessionOrBreakLength = useCallback((count) => {
    //console.log('appendSessionOrBreakLength:', count)
    // (count) is `breakLength` or `sessionLength`. Invoked from inline method returned from CountDown component
    const min = Math.floor(count / 60)
    return min
  }, [timeInSession]);

  const playPauseTimer = useCallback(() => {
    console.log('playPauseTimer', toggle)

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
  }, [toggle]);

  const notOnBreak = useCallback((prev, yesRightNow) => {
    console.log('notOnBreak', prev, yesRightNow)
    if (prev === 0 && yesRightNow === false){
      playSound();
      yesRightNow = true
      setCanIhaveABreak(true)
      setTimeLabel(true)
      return breakLength
    } else if(prev === 0 && yesRightNow === true) {
      playSound();
      setCanIhaveABreak(false)
      setTimeLabel(false)
      return sessionLength
    }
    return prev -1
  }, [playPauseTimer]);

  const toggleSession = () => {
    if (!toggle) {
      setToggle(true);
      return playPauseTimer()
    } else if (toggle) {
      setToggle(false);
      return playPauseTimer()
    };
  }

  const playSound = useCallback(() => {
    let audioBeep = document.getElementById('beep');
    audioBeep.currentTime = 0;
    const beepPromise = audioBeep.play()
      if (beepPromise !== undefined) {
        beepPromise
          .then(_ => {
            console.log("%caudio played auto", 'color: green;');
          })
          .catch(error => {
            console.err(`Error ${error} Check "playSound", Import and <audio> element.`);
          });
      }
  }, [canIHaveABreak]);

  const resetState = () => {
    clearInterval(localStorage.getItem('int'));
    setToggle(false); // clearInterval was b4
    setTimeLabel(false);
    setCanIhaveABreak(false);
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
      {/* All of the Break attributes/properties/methods */}
        <CountDown
          h3label={'break-label'} 
          title={"Break Length"} 
          decrement={'break-decrement'} 
          increment={'break-increment'} 
          lengthCounter={'break-length'} 
          changeClock={changeClock}
          type={"break"}
          count={breakLength}
          appendSeshOrBreak={appendSessionOrBreakLength}
        />
      </div>
      {/* Middle Component. A Timer counting down */}
      <div>
        <h3 id="timer-label">{ timeLabel ? 'Break' : 'Session' }</h3>
        <audio id='beep' src={audioBeep} />
      </div>
      <div id="heading2">
        <h2 id="time-left" className="timer">{appendTime(timeInSession)}</h2>
      </div>
      <div id="session">
      {/* All of the Session attributes/properties/methods */}
        <CountDown
          h3label={'session-label'} 
          title={"Session Length"} 
          decrement={'session-decrement'} 
          increment={'session-increment'} 
          lengthCounter={'session-length'} 
          changeClock={changeClock}
          type={"session"}
          count={sessionLength}
          appendSeshOrBreak={appendSessionOrBreakLength}
        />
      </div>
      {/* Play/Pause/Reset */}
      <div id="play-refresh">
      <button id='start_stop' onClick={toggleSession}>
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
