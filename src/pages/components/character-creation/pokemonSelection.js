import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useMutation, gql, useQuery } from "@apollo/client";

const CREATE_POKEMON = gql`
  mutation CreatePokemon($pokemon: String!) {
    createPokemon(pokemon: $pokemon) {
      name
      sprites
      id
      types
      level
      xp
      max_xp
      health
      max_health
      attack
      defense
      speed
      moveset {
        name
        flavor_text
        stat_changes {
          change
          stat {
            name
            url
          }
        }
        type
        power
        accuracy
        current_pp
        max_pp
      }
      fullMoveset {
        name
        url
        level_learned_at
      }
    }
  }
`;

const UPDATE_USER = gql`
  mutation updateUser($id: ID!, $pokemon: [PokemonInput]!) {
    updateUser(id: $id, pokemon: $pokemon) {
      id
      username
      email
      pokemon {
        name
        level
      }
      pc
      money
      items
      badges
      gender
    }
  }
`;

const PokemonSelection = ({ onNext }) => {
  const [userId, setUserId] = useState(undefined);
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    setUserId(userId);
  }, [userId]);

  const [PokemonSelected, setPokemonSelected] = useState(undefined);
  const [createPokemon] = useMutation(CREATE_POKEMON);
  const [updateUser] = useMutation(UPDATE_USER);

  const handlePokemonSelection = async (pokemon) => {
    setPokemonSelected(pokemon);
  };

  const handleContinue = async () => {
    const result = await createPokemon({
      variables: { pokemon: PokemonSelected },
    });
    const createdPokemon = result.data.createPokemon;

    console.log(userId);
    console.log(`Created Pokemon with id ${createdPokemon.id}`);

    delete createdPokemon.__typename;

    for (let i = 0; i < createdPokemon.moveset.length; i++) {
      delete createdPokemon.moveset[i].__typename;
      delete createdPokemon.moveset[i].stat_changes[0].__typename;
      delete createdPokemon.moveset[i].stat_changes[0].stat[0].__typename;
    }

    for (let i = 0; i < createdPokemon.fullMoveset.length; i++) {
      delete createdPokemon.fullMoveset[i].__typename;
    }

    console.log(createdPokemon);

    const user = await updateUser({
      variables: {
        id: userId,
        pokemon: [createdPokemon],
      },
    });
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
            (PokemonSelected == "bulbasaur"
              ? " outline outline-offset-2 outline-green-500"
              : "")
          }
        >
          <h3 className="text-center">Bulbasaur</h3>
          <div className="container mx-auto mt-4">
            <Image
              src="/bulbasaur.gif"
              alt="Pokemon character sprite"
              height="60"
              width="60"
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
            (PokemonSelected == "charmander"
              ? " outline outline-offset-2 outline-red-500"
              : "")
          }
        >
          <h3 className="text-center">Charmander</h3>
          <div className="container mx-auto mt-4">
            <Image
              src="/charmander.gif"
              alt="Pokemon character sprite"
              height="60"
              width="60"
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
            (PokemonSelected == "squirtle"
              ? " outline outline-offset-2 outline-blue-500"
              : "")
          }
        >
          <h3 className="text-center">Squirtle</h3>
          <div className="container mx-auto mt-4">
            <Image
              src="/squirtle.gif"
              alt="Pokemon character sprite"
              height="60"
              width="60"
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
