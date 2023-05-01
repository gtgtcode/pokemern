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
        attack
        defense
        id
        name
        level
        sprites
        health
        speed
        xp
        max_xp
        moveset {
          name
          power
          flavor_text
          accuracy
          type
          max_pp
          stat_changes {
            change
            stat {
              name
              url
            }
          }
        }
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

const UPDATE_USER = gql`
  mutation UpdateUser($id: ID!, $money: Int) {
    updateUser(id: $id, money: $money) {
      id
      money
    }
  }
`;

const UPDATE_POKEMON = gql`
  mutation UpdatePokemonXp($id: ID!, $xp: Int!) {
    updatePokemon(id: $id, xp: $xp) {
      id
      xp
    }
  }
`;

const GameScreen = () => {
  const [gameState, setgameState] = useState(0); // 0 for overworld, 1 for battle
  const [userId, setUserId] = useState(null);
  const [pokemonAmount, setPokemonAmount] = useState(null);
  const [createEnemy] = useMutation(CREATE_ENEMY);
  const [updateUser] = useMutation(UPDATE_USER);
  const [updatePokemon] = useMutation(UPDATE_POKEMON);
  const [EnemyHealth, setEnemyHealth] = useState(undefined);
  const [EnemyAttack, setEnemyAttack] = useState(undefined);
  const [EnemyDefense, setEnemyDefense] = useState(undefined);
  const [EnemyPokemon, setEnemyPokemon] = useState(undefined);
  const [currentHealth, setCurrentHealth] = useState(undefined);
  const [currentAttack, setCurrentAttack] = useState(undefined);
  const [currentDefense, setCurrentDefense] = useState(undefined);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    setUserId(userId);
  }, [userId]);

  const handleAttack = async (
    playerHealth,
    enemyHealth,
    moveUsed,
    enemyMoveset,
    pokemonData,
    enemyData
  ) => {
    console.log(playerHealth);
    console.log(enemyHealth);
    console.log(enemyMoveset);
    console.log(moveUsed);

    console.log(pokemonData);

    async function playerAttack() {
      const newEnemyHealth =
        EnemyHealth -
        Math.floor(
          moveUsed.power / 3 + pokemonData.attack / pokemonData.defense
        );
      setEnemyHealth(newEnemyHealth);
      console.log(newEnemyHealth);

      if (moveUsed.stat_changes[0].change !== 0) {
        if (moveUsed.stat_changes[0].name == "attack") {
          const newEnemyAttack = EnemyAttack + moveUsed.stat_changes[0].change;
          setEnemyAttack(newEnemyAttack);
        }
        if (moveUsed.stat_changes[0].name == "defense") {
          const newEnemyDefense =
            EnemyDefense + moveUsed.stat_changes[0].change;
          setEnemyAttack(newEnemyDefense);
        }
      }

      if (newEnemyHealth <= 0) {
        const { id, xp } = data.userById.pokemon[0];
        const newMoney = data.userById.money + 20;
        const newXP = xp + 30;
        const fullMoveset = JSON.parse(localStorage.getItem("fullMoveset"));
        console.log("newXP " + newXP);
        const user = await updateUser({
          variables: {
            id: userId,
            money: newMoney,
            pokemon: {
              id: data.userById.pokemon[0].id,
              xp: newXP,
            },
          },
        });
      }
    }

    function enemyAttack() {
      const enemyMoveUsed = enemyMoveset[Math.floor(Math.random() * 2)];
      const newPlayerHealth =
        currentHealth -
        Math.floor(
          enemyMoveUsed.power / 3 + enemyData.attack / enemyData.defense
        );
      setCurrentHealth(newPlayerHealth);
      console.log(newPlayerHealth);

      if (enemyMoveUsed.stat_changes[0].change !== 0) {
        if (moveUsed.stat_changes[0].name == "attack") {
          const newPokemonAttack =
            currentAttack + moveUsed.stat_changes[0].change;
          setCurrentAttack(newPokemonAttack);
        }
        if (enemyMoveUsed.stat_changes[0].name == "defense") {
          const newPokemonDefense =
            currentDefense + moveUsed.stat_changes[0].change;
          setCurrentDefense(newPokemonDefense);
        }
      }
    }

    if (pokemonData && pokemonData.speed > enemyData.speed) {
      playerAttack();
      enemyAttack();
    } else {
      enemyAttack();
      playerAttack();
    }
  };

  var initialized = false;

  const { loading, error, data } = useQuery(USER_INFO, {
    variables: { id: userId },
    skip: !userId, // Skip the query if userId is not set
  });

  if (!loading && currentHealth <= 0) {
    setEnemyPokemon(undefined);
    setCurrentHealth(data.userById.pokemon[0].health);
  }

  useEffect(() => {
    const initializeEnemyPokemon = async () => {
      initialized = false;
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
        "farfetchd",
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
          gen1NonEvolutions[Math.floor(Math.random() * 58)]
        }/`
      );
      console.log(randomPokemon);
      const newEnemyPokemon = await createEnemy({
        variables: { pokemon: randomPokemon.data.name },
      });
      setEnemyPokemon(newEnemyPokemon.data.createPokemon);
    };

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
      setCurrentHealth(
        data && data.userById && data.userById.pokemon[0].health
      );
      setCurrentAttack(
        data && data.userById && data.userById.pokemon[0].attack
      );
      setCurrentDefense(
        data && data.userById && data.userById.pokemon[0].defense
      );
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
            <audio src="/battle.mp3" autoPlay loop></audio>
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
                currentHealth={currentHealth}
              />
            )}
            {gameState == 0 && (
              <EnemyHealthBar
                name={EnemyPokemon && EnemyPokemon.name}
                level={EnemyPokemon && EnemyPokemon.level}
                health={EnemyPokemon && EnemyPokemon.health}
                attack={EnemyPokemon && EnemyPokemon.attack}
                defense={EnemyPokemon && EnemyPokemon.defense}
                EnemyHealth={EnemyHealth}
                setEnemyHealth={setEnemyHealth}
                setEnemyPokemon={setEnemyPokemon}
                setEnemyAttack={setEnemyAttack}
                setEnemyDefense={setCurrentDefense}
              />
            )}
            {gameState == 0 && (
              <GameConsole
                pokemonName={
                  data && data.userById && data.userById.pokemon[0].name
                }
                pokemonMoves={
                  data && data.userById && data.userById.pokemon[0].moveset
                }
                pokemonData={data && data.userById && data.userById.pokemon[0]}
                enemyMoves={EnemyPokemon && EnemyPokemon.moveset}
                enemyData={EnemyPokemon}
                handleAttack={handleAttack}
              />
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default GameScreen;
