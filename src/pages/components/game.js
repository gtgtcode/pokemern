import React, { useState, useEffect } from "react";
import { gql, useQuery } from "@apollo/client";
import TrainerCard from "./game-ui/trainer-card";
import GameScreen from "./game-ui/game-screen";

const USER_POKEMON = gql`
  query getUserPokemon($id: ID!) {
    userById(id: $id) {
      id
      username
      pokemon {
        id
        name
        types
        sprites
        level
        xp
        max_xp
        health
        max_health
        moveset {
          name
          type
          power
          accuracy
          flavor_text
          stat_changes {
            change
            stat {
              name
              url
            }
          }
          current_pp
          max_pp
        }
        attack
        defense
        speed
      }
    }
  }
`;

const Game = () => {
  const [userId, setUserId] = useState(null);
  const [pokemonAmount, setPokemonAmount] = useState(null);

  const { loading, error, data } = useQuery(USER_POKEMON, {
    variables: { id: userId },
    skip: !userId, // Skip the query if userId is not set
  });

  useEffect(() => {
    setUserId(localStorage.getItem("userId"));
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (loading || error || !data) return;

      const pokemonCount = data.userById.pokemon.length;
      console.log(data.userById.username);
      console.log(pokemonCount);

      setPokemonAmount(pokemonCount); // Set pokemonAmount to the fetched pokemon count
    };

    fetchData();
  }, [loading, error, data]);

  const [Progress, setProgress] = useState(0);
  return (
    pokemonAmount > 0 && (
      <div>
        <TrainerCard />
        <GameScreen />
      </div>
    )
  );
};

export default Game;
