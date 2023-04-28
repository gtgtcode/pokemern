import React, { useState, useEffect } from "react";
import { gql, useQuery, useMutation } from "@apollo/client";
import Image from "next/image";
import GameConsole from "./game-console";
import PlayerHealth from "./player-health";
import EnemyHealthBar from "./enemy-health";
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

  useEffect(() => {
    console.log(
      `https://pokeapi.co/api/v2/pokemon/${Math.floor(
        Math.random() * 152
      ).toString()}/`
    );
    async function initializeEnemyPokemon() {
      setEnemyPokemon("a");
      const gen1NonEvolutions = [
        "bulbasaur",
        "charmander",
        "squirtle",
        "pikachu",
        "clefairy",
        "vulpix",
        "jigglypuff",
        "zubat",
        "geodude",
        "paras",
        "diglett",
        "meowth",
        "psyduck",
        "mankey",
        "poliwag",
        "abra",
        "machop",
        "bellsprout",
        "tentacool",
        "ponyta",
        "slowpoke",
        "magnemite",
        "farfetch'd",
        "doduo",
        "seel",
        "grimer",
        "shellder",
        "gastly",
        "onix",
        "drowzee",
        "krabby",
        "voltorb",
        "exeggcute",
        "cubone",
        "koffing",
        "rhyhorn",
        "chansey",
        "tangela",
        "kangaskhan",
        "horsea",
        "goldeen",
        "staryu",
        "mr. mime",
        "scyther",
        "jynx",
        "electabuzz",
        "magmar",
        "pinsir",
        "tauros",
        "magikarp",
        "lapras",
        "ditto",
        "eevee",
        "porygon",
        "omanyte",
        "kabuto",
        "snorlax",
        "dratini",
      ];
      console.log(gen1NonEvolutions.length);
      const randomPokemon = await axios.get(
        `https://pokeapi.co/api/v2/pokemon/${
          gen1NonEvolutions[Math.floor(Math.random() * 59)]
        }/`
      );
      console.log(randomPokemon);
      const newEnemyPokemon = await createEnemy({
        variables: { pokemon: randomPokemon.data.name },
      });
      setEnemyPokemon(newEnemyPokemon.data.createPokemon);
    }

    if (EnemyPokemon === undefined) {
      initializeEnemyPokemon();
    }
  }, [createEnemy, EnemyPokemon]);

  console.log(EnemyPokemon);

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
            className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 overflow-hidden border border-4"
          >
            <Image
              src={gameState == 0 ? "/battle-background.png" : "/"}
              alt="Background sprite"
              height="600"
              width="600"
              className="mx-auto h-full w-full"
            />
            <Image
              src={gameState == 0 ? "/grass.png" : "/"}
              alt="Grass sprite"
              height="600"
              width="800"
              className="absolute right-20 top-3 mx-auto h-full w-full scale-[1.2]"
            />
            <Image
              src={gameState == 0 ? "/player-bg.png" : "/"}
              alt="Grass sprite"
              height="600"
              width="800"
              className="absolute -top-10 left-0 mx-auto h-full w-full"
            />
            <img
              src={data && data.userById && data.userById.pokemon[0].sprites[0]}
              alt="Player Pokemon"
              className="absolute bottom-[150px] left-[100px] scale-[4]"
            />
            <img
              src={
                EnemyPokemon && EnemyPokemon.sprites && EnemyPokemon.sprites[1]
              }
              alt="Enemy Pokemon"
              className="absolute right-[160px] top-[235px] origin-bottom scale-[3] text-center"
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
            {gameState == 0 && (
              <EnemyHealthBar
                name={EnemyPokemon && EnemyPokemon.name}
                level={EnemyPokemon && EnemyPokemon.level}
                health={EnemyPokemon && EnemyPokemon.health}
                currentHealth={EnemyHealth}
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
