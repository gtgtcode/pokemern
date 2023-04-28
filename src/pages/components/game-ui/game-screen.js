import React, { useState, useEffect } from "react";
import { gql, useQuery, useMutation } from "@apollo/client";
import Image from "next/image";
import GameConsole from "./game-console";
import PlayerHealth from "./player-health";
import axios from "axios";

const USER_INFO = gql`
  query getUserInfo($id: ID!) {
    userById(id: $id) {
      id
      username
      money
      pokemon {
        name
        level
        sprites
        health
        xp
        max_xp
      }
    }
  }
`;

const CREATE_ENEMY = gql`
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

const GameScreen = () => {
  const [gameState, setgameState] = useState(0); // 0 for overworld, 1 for battle
  const [userId, setUserId] = useState(null);
  const [pokemonAmount, setPokemonAmount] = useState(null);
  const [createEnemy] = useMutation(CREATE_ENEMY);
  const [EnemyHealth, setEnemyHealth] = useState(undefined);
  const [EnemyPokemon, setEnemyPokemon] = useState(undefined);

  const { loading, error, data } = useQuery(USER_INFO, {
    variables: { id: userId },
    skip: !userId, // Skip the query if userId is not set
  });

  async function createEnemyPokemon() {
    let pokeId = await axios.get(
      `https://pokeapi.co/api/v2/pokemon/${Math.floor(Math.random() * 152)}/`
    );
    let data = pokeId.data;
    console.log(data);
    setEnemyPokemon(
      await createEnemy({
        variables: { pokemon: `${data.name}` },
      })
    );
    console.log(EnemyPokemon);
  }

  if (EnemyPokemon == undefined) {
    createEnemyPokemon();
  }

  useEffect(() => {
    setUserId(localStorage.getItem("userId"));
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (loading || error || !data) return;

      const pokemonCount = data.userById.pokemon.length;
      console.log(data.userById);
      console.log(pokemonCount);

      setPokemonAmount(pokemonCount); // Set pokemonAmount to the fetched pokemon count
    };

    fetchData();
  }, [loading, error, data]);

  return (
    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error: {error.message}</p>
      ) : (
        <>
          <div
            id="game-screen"
            className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 border border-4"
          >
            <Image
              src={gameState == 0 ? "/light-green.jpg" : "/"}
              alt="Background sprite"
              height="600"
              width="600"
              className="mx-auto h-full w-full"
            />
            <Image
              src={data && data.userById && data.userById.pokemon[0].sprites[0]}
              alt="Player Pokemon"
              height="150"
              width="150"
              className="absolute bottom-[100px] left-[60px]"
            />
            <Image
              src={data && data.userById && data.userById.pokemon[0].sprites[1]}
              alt="Enemy Pokemon"
              height="100"
              width="100"
              className="absolute right-[60px] top-[100px]"
            />
            {gameState == 0 && (
              <PlayerHealth
                name={data && data.userById && data.userById.pokemon[0].name}
                level={data && data.userById && data.userById.pokemon[0].level}
                health={
                  data && data.userById && data.userById.pokemon[0].health
                }
                max_xp={
                  data && data.userById && data.userById.pokemon[0].max_xp
                }
                current_xp={
                  data && data.userById && data.userById.pokemon[0].xp
                }
              />
            )}
            {gameState == 0 && <GameConsole />}
          </div>
        </>
      )}
    </div>
  );
};

export default GameScreen;
