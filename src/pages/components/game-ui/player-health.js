import React, { useState } from "react";

const PlayerHealthBar = (props) => {
  const [currentHealth, setcurrentHealth] = useState(props.health);
  return (
    <div className="absolute bottom-[200px] right-0 h-[90px] w-[250px] rounded-tl-[80px] bg-gray-200 p-4 pl-10">
      <h1 id="pokemon-name" className="inline">
        {props && props.name && props.name.toUpperCase()}
      </h1>
      <p id="level" className="float-right inline">
        LV. {props.level}
      </p>
      <br />
      <p id="health-amount" className="float-right">
        {currentHealth}/{props.health}
      </p>
      <br />
      <div
        className="absolute bottom-3 right-2 float-right mt-2 h-[10px] w-[220px] rounded-[2px] bg-gray-400 outline outline-4 outline-gray-800"
        id="full-health-bar"
      >
        <div className="outline-t-0 absolute -top-6 left-0 rounded-tl-[20px] rounded-tr-[2px] bg-gray-800 pl-1 text-white outline outline-4 outline-gray-800">
          HP
        </div>
        <div
          className={
            "absolute -top-2 float-right mt-2 h-[10px] rounded-[2px] bg-green-400  transition"
          }
          style={{
            width: `${(currentHealth / props.health) * 100}%`,
            transiton: `width 2s`,
          }}
          id="player-health-bar"
        ></div>
      </div>
      <div
        className="absolute -bottom-[10px] right-0 h-[10px] w-[180px] rounded-bl-[40px] bg-gray-400"
        id="full-xp-bar"
      >
        <div
          className={
            "absolute -top-2 float-right mt-2 h-[10px] rounded-bl-[40px] bg-green-400 transition"
          }
          style={{
            width: `${(props.current_xp / props.max_xp) * 100}%`,
            transiton: `width 2s`,
          }}
          id="player-health-bar"
        ></div>
      </div>
    </div>
  );
};

export default PlayerHealthBar;
