import React, { useState, useEffect } from "react";
import Image from "next/image";
import { gql, useMutation } from "@apollo/client";

const UPDATE_USER = gql`
  mutation UpdateUser($id: ID!, $gender: Int) {
    updateUser(id: $id, gender: $gender) {
      id
      gender
    }
  }
`;

const GenderSelection = ({ onNext }) => {
  const [CharacterSelected, setCharacterSelected] = useState(undefined);
  const [updateUser] = useMutation(UPDATE_USER);
  const [userId, setUserId] = useState(null);
  let enemyPokemon = undefined;

  async function createEnemyPokemon() {}

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

  const handleGenderSelection = async (gender) => {
    setCharacterSelected(gender);
    try {
      const { data } = await updateUser({
        variables: { id: userId, gender },
      });
      console.log("Updated user gender:", data.updateUser.gender);
    } catch (error) {
      console.error("Failed to update user gender:", error);
    }
  };

  return (
    <div className="absolute left-1/2 top-1/2 min-w-[300px] -translate-x-1/2 -translate-y-1/2 p-10">
      <h1 className="text-center text-2xl">
        Hello, and welcome to the world of Pokémon!
      </h1>
      <h2 className="mt-4 text-center text-xl">Please select your gender:</h2>
      <div className="mt-10 grid grid-cols-2 gap-4">
        <button
          onClick={() => {
            handleGenderSelection(0);
          }}
          className={
            "rounded-[40px] bg-gray-200 p-4 md:p-8" +
            (CharacterSelected == 0
              ? " outline outline-offset-2 outline-blue-500"
              : "")
          }
        >
          <h3 className="text-center">Boy</h3>
          <div className="container mx-auto mt-4">
            <Image
              src="/boy-sprite.png"
              alt="Boy character sprite"
              height="100"
              width="100"
              className="mx-auto"
            />
          </div>
        </button>
        <button
          onClick={() => {
            handleGenderSelection(1);
          }}
          className={
            "rounded-[40px] bg-gray-200 p-4 md:p-8" +
            (CharacterSelected == 1
              ? " outline outline-offset-2 outline-pink-500"
              : "")
          }
        >
          <h3 className="text-center">Girl</h3>
          <div className="container mx-auto mt-4">
            <Image
              src="/girl-sprite.png"
              alt="Girl character sprite"
              height="100"
              width="100"
              className="mx-auto"
            />
          </div>
        </button>
      </div>
      <div className="text-center">
        <button
          onClick={onNext}
          disabled={CharacterSelected === undefined}
          className={
            "mt-8 rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700" +
            (CharacterSelected === undefined
              ? " cursor-not-allowed opacity-50"
              : "")
          }
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default GenderSelection;
