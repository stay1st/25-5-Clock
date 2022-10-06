import React from "react";

function CountDown({
  h3label,
  title,
  decrement,
  increment,
  lengthCounter,
  changeClock,
  type,
  count,
  appendSeshOrBreak,
}) {
  return (
    <div>
      <h3 id={h3label}>{title}</h3>
      <div className="break-session">
        <button id={decrement} onClick={() => changeClock(-60, type)}>
          <p>DOWN</p>
          <i className="fa-solid fa-angle-down"></i>
        </button>
        <h3 id={lengthCounter}>{appendSeshOrBreak(count)}</h3>
        <button id={increment} onClick={() => changeClock(60, type)}>
          <i className="fa-solid fa-angle-up">
            <p>UP</p>
          </i>
        </button>
      </div>
    </div>
  );
}
export default CountDown;
