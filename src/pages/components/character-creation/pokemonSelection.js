import React, { useState } from "react";
import Image from "next/image";
import { useMutation, gql } from "@apollo/client";

const CREATE_POKEMON = gql`
  mutation CreatePokemon($pokemon: String!) {
    createPokemon(pokemon: $pokemon) {
      name
      types
      id
    }
  }
`;

const PokemonSelection = ({ onNext }) => {
  const [PokemonSelected, setPokemonSelected] = useState(undefined);
  const [createPokemon] = useMutation(CREATE_POKEMON);

  const handlePokemonSelection = async (pokemon) => {
    setPokemonSelected(pokemon);
  };

  const handleContinue = async () => {
    const result = await createPokemon({
      variables: { pokemon: PokemonSelected },
    });
    console.log(result);
    console.log(`Created Pokemon with id ${result.data.createPokemon.id}`);
    onNext();
  };

  return (
    <div className="absolute left-1/2 top-1/2 min-w-[300px] -translate-x-1/2 -translate-y-1/2 p-10">
      <h1 className="text-center text-2xl">
        Hello, and welcome to the world of Pokémon!
      </h1>
      <h2 className="mt-4 text-center text-xl">
        Please select your starter pokémon:
      </h2>
      <div className="mt-10 grid grid-cols-3 gap-4">
        <button
          onClick={() => {
            handlePokemonSelection("bulbasaur");
          }}
          className={
            "rounded-[40px] bg-gray-200 p-4 md:p-8" +
            (PokemonSelected == 0
              ? " outline outline-offset-2 outline-green-500"
              : "")
          }
        >
          <h3 className="text-center">Bulbasaur</h3>
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
            handlePokemonSelection("charmander");
          }}
          className={
            "rounded-[40px] bg-gray-200 p-4 md:p-8" +
            (PokemonSelected == 1
              ? " outline outline-offset-2 outline-red-500"
              : "")
          }
        >
          <h3 className="text-center">Charmander</h3>
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
        <button
          onClick={() => {
            handlePokemonSelection("squirtle");
          }}
          className={
            "rounded-[40px] bg-gray-200 p-4 md:p-8" +
            (PokemonSelected == 2
              ? " outline outline-offset-2 outline-blue-500"
              : "")
          }
        >
          <h3 className="text-center">Squirtle</h3>
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
          onClick={() => {
            handleContinue();
            onNext();
          }}
          disabled={PokemonSelected === undefined}
          className={
            "mt-8 rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700" +
            (PokemonSelected === undefined
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

export default PokemonSelection;
