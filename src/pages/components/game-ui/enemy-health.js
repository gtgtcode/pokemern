import React, { useState, useEffect } from "react";

const EnemyHealth = (props) => {
  useEffect(() => {
    props.setEnemyHealth(props.health);
    props.setEnemyAttack(props.attack);
    props.setEnemyDefense(props.defense);
  }, [props.health]);

  if (props.EnemyHealth <= 0) {
    props.setEnemyPokemon(undefined);
  }

  return (
    <div className="absolute left-0 top-[100px] h-[90px] w-[250px] rounded-tr-[80px] bg-gray-200 p-4 pr-10">
      <h1 id="pokemon-name" className="inline">
        {props && props.name && props.name.toUpperCase()}
      </h1>
      <p id="level" className="float-right inline pr-4">
        LV. {props.level}
      </p>
      <br />
      <p id="health-amount" className="float-right pr-4">
        {props.EnemyHealth}/{props.health}
      </p>
      <br />
      <div
        className="absolute bottom-3 left-2 float-right mt-2 h-[10px] w-[220px] rounded-[2px] bg-gray-400 outline outline-4 outline-gray-800"
        id="full-health-bar"
      >
        <div className="outline-t-0 absolute -top-6 right-0 rounded-tl-[2px] rounded-tr-[20px] bg-gray-800 pr-1 text-white outline outline-4 outline-gray-800">
          HP
        </div>
        <div
          className={
            "absolute -top-2 float-right mt-2 h-[10px] rounded-[2px] bg-green-400"
          }
          style={{
            width: `${(props.EnemyHealth / props.health) * 100}%`,
            transiton: `width 2s`,
          }}
          id="enemy-health-bar"
        ></div>
      </div>
    </div>
  );
};

export default EnemyHealth;
