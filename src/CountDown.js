import React from "react";

function CountDown({ title, changeClock, type, count, appendTime }) {
    
  return (
    <div>
      <h3 id="session-label">{title}</h3>
      <div className="break-session">
        <button onClick={() => changeClock(-60, type)}>
          <p>DOWN</p>
          <i className="fa-solid fa-angle-down"></i>
        </button>
        <h3 id="timer">{appendTime(count)}</h3>
        <button onClick={() => changeClock(60, type)}>
          <i className="fa-solid fa-angle-up">
            <p>UP</p>
          </i>
        </button>
      </div>
    </div>
  );
};
export default CountDown;
