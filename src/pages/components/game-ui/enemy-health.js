import React, { useState } from "react";

const EnemyHealth = (props) => {
  return (
    <div className="absolute left-0 top-[100px] h-[90px] w-[250px] rounded-tr-[80px] bg-gray-200 p-4 pr-10">
      <h1 id="pokemon-name" className="inline">
        {props && props.name && props.name.toUpperCase()}
      </h1>
      <p id="level" className="float-right inline">
        LV. {props.level}
      </p>
      <br />
      <p id="health-amount" className="float-right pr-4">
        {props.currentHealth}/{props.health}
      </p>
      <br />
      <div
        className="absolute bottom-3 left-2 float-right mt-2 h-[10px] w-[220px] rounded-[2px] bg-gray-400 outline outline-4 outline-gray-800"
        id="full-health-bar"
      >
        <div className="outline-t-0 absolute -top-6 right-0 rounded-tr-[20px] rounded-tr-[2px] bg-gray-800 pr-1 text-white outline outline-4 outline-gray-800">
          HP
        </div>
        <div
          className={
            "absolute -top-2 float-right mt-2 h-[10px] rounded-[2px] bg-green-400  transition"
          }
          style={{
            width: `${(props.currentHealth / props.health) * 100}%`,
            transiton: `width 2s`,
          }}
          id="player-health-bar"
        ></div>
      </div>
    </div>
  );
};

export default EnemyHealth;
