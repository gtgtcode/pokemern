import { useMutation, useQuery, gql } from "@apollo/client";
import React, { useState } from "react";

const BattleMenu = (props, { handleAttack }) => {
  const [BattleMenuState, setBattleMenuState] = useState("overview");
  const [MoveHover, setMoveHover] = useState(undefined);

  console.log(props.pokemonMoves);
  return (
    <div className="relative h-full w-full">
      {BattleMenuState == "overview" && (
        <div className="relative top-1/2 grid -translate-y-1/2 grid-cols-2 grid-rows-2 gap-4 text-center">
          <button
            onClick={() => {
              setBattleMenuState("fight-menu");
            }}
            className="ml-4 rounded-full border-2 border-white bg-red-400 p-2 text-xl font-bold text-white outline outline-2 outline-offset-2 outline-gray-800 hover:bg-red-700 hover:outline-red-700"
          >
            FIGHT
          </button>
          <button
            onClick={() => {
              setBattleMenuState("item-menu");
            }}
            className="mr-4 rounded-full border-2 border-white bg-orange-400 p-2 text-center text-xl font-bold text-white outline outline-2 outline-offset-2 outline-gray-800 hover:bg-orange-700 hover:outline-orange-700"
          >
            ITEM
          </button>
          <button className="ml-4 rounded-full border-2 border-white bg-green-400 p-2 text-center text-xl font-bold text-white outline outline-2 outline-offset-2 outline-gray-800 hover:bg-green-700 hover:outline-green-700">
            POKEMON
          </button>
          <button className="mr-4 rounded-full border-2 border-white bg-blue-400 p-2 text-center text-xl font-bold text-white outline outline-2 outline-offset-2 outline-gray-800 hover:bg-blue-700 hover:outline-blue-700">
            RUN
          </button>
        </div>
      )}
      {BattleMenuState == "fight-menu" && (
        <div className="bg-white-500 absolute -left-[105%] grid h-[140px] w-[205%] grid-cols-2">
          <div className="relative grid grid-cols-2 grid-rows-2 border-y-2 border-l-2 border-gray-600 bg-white">
            <div className="relative top-1/2 -translate-y-1/2 p-[15%] text-center">
              <button
                onClick={() => {
                  props.handleAttack(
                    props.pokemonData.health,
                    props.enemyData.health,
                    props.pokemonData.moveset[0],
                    props.enemyData.moveset,
                    props.pokemonData,
                    props.enemyData
                  );
                  setBattleMenuState("overview");
                }}
                onMouseEnter={() => {
                  setMoveHover(props.pokemonMoves[0]);
                }}
                onMouseLeave={() => {
                  setMoveHover(undefined);
                }}
              >
                {
                  props.pokemonMoves &&
                    props.pokemonMoves[0] &&
                    props.pokemonMoves[0].name
                      .split("-") // Split the string by hyphens
                      .map(
                        (word) => word.charAt(0).toUpperCase() + word.slice(1)
                      ) // Capitalize the first letter of each word
                      .join(" ") // Join the words back together with a space
                }
              </button>
            </div>
            <div className="relative top-1/2 -translate-y-1/2 p-[15%] text-center">
              <button
                onClick={() => {
                  props.handleAttack(
                    props.pokemonData.health,
                    props.enemyData.health,
                    props.pokemonData.moveset[1],
                    props.enemyData.moveset,
                    props.pokemonData,
                    props.enemyData
                  );
                  setBattleMenuState("overview");
                }}
                onMouseEnter={() => {
                  setMoveHover(props.pokemonMoves[1]);
                }}
                onMouseLeave={() => {
                  setMoveHover(undefined);
                }}
              >
                {
                  props.pokemonMoves &&
                    props.pokemonMoves[1] &&
                    props.pokemonMoves[1].name
                      .split("-") // Split the string by hyphens
                      .map(
                        (word) => word.charAt(0).toUpperCase() + word.slice(1)
                      ) // Capitalize the first letter of each word
                      .join(" ") // Join the words back together with a space
                }
              </button>
            </div>
          </div>
          <div className="border-y-2 border-r-2 border-gray-600 bg-white">
            {MoveHover !== undefined && (
              <div className="p-4">
                {
                  MoveHover.name
                    .split("-") // Split the string by hyphens
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize the first letter of each word
                    .join(" ") // Join the words back together with a space
                }
                <br />
                PP: {MoveHover.max_pp}
                <br />
                Accuracy: {MoveHover.accuracy}
                <br />
                Type: {MoveHover.type.toUpperCase()}
              </div>
            )}
            <button
              onClick={() => {
                setBattleMenuState("overview");
              }}
              className="absolute right-[2px] top-[2px] rounded-bl-[40px] border-b-2 border-l-2 border-gray-600 bg-white p-2 pl-8 pr-4"
            >
              {"<-"} BACK
            </button>
          </div>
        </div>
      )}
      {BattleMenuState == "item-menu" && (
        <div className="bg-white-500 absolute -left-[105%] grid h-[140px] w-[205%] grid-cols-2">
          <div className="relative grid grid-cols-2 grid-rows-2 border-y-2 border-l-2 border-gray-600 bg-white">
            <div className="relative top-1/2 -translate-y-1/2 p-[15%] text-center">
              <button
                onClick={() => {
                  setBattleMenuState("overview");
                  if (props.userData.items.length > 0) {
                    const newMoney = props.userData.money;
                    const newItems = props.userData.items.slice(0, -1);
                    props.handleUpdateItems(
                      props.userData.id,
                      newMoney,
                      newItems
                    );
                    props.setCurrentHealth(props.health);
                  }
                }}
              >
                Potion x{props.userData.items.length}
              </button>
            </div>
            <div className="relative top-1/2 -translate-y-1/2 p-[15%] text-center"></div>
          </div>
          <div className="border-y-2 border-r-2 border-gray-600 bg-white">
            <div className="mt-10 text-center">
              You can buy potions here!
              <button
                className="mr-2 mt-2 rounded-full border border-2 p-2"
                onClick={async () => {
                  if (props.userData.money >= 40) {
                    const newMoney = props.userData.money - 40;
                    const newItems = [...props.userData.items, "potion"];
                    props.handleUpdateItems(
                      props.userData.id,
                      newMoney,
                      newItems
                    );
                  }
                }}
              >
                1x Potion - ₽40
              </button>
              <button
                className="rounded-full border border-2 p-2"
                onClick={async () => {
                  if (props.userData.money >= 160) {
                    const newMoney = props.userData.money - 160;
                    const newItems = [
                      ...props.userData.items,
                      "potion",
                      "potion",
                      "potion",
                      "potion",
                      "potion",
                    ];
                    props.handleUpdateItems(
                      props.userData.id,
                      newMoney,
                      newItems
                    );
                  }
                }}
              >
                5x Potion - ₽160
              </button>
            </div>
            <button
              onClick={() => {
                setBattleMenuState("overview");
              }}
              className="absolute right-[2px] top-[2px] rounded-bl-[40px] border-b-2 border-l-2 border-gray-600 bg-white p-2 pl-8 pr-4"
            >
              {"<-"} BACK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BattleMenu;
