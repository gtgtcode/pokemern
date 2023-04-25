import React, { useState, useEffect } from "react";
import { gql, useQuery } from "@apollo/client";

const USER_POKEMON = gql`
  query getUserPokemon($id: ID!) {
    userById(id: $id) {
      id
      username
      pokemon
    }
  }
`;

export default function CreateCharacter() {
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
      console.log(pokemonCount);

      setPokemonAmount(pokemonCount); // Set pokemonAmount to the fetched pokemon count
    };

    fetchData();
  }, [loading, error, data]);

  const [Progress, setProgress] = useState(0);
  return (
    <div>{!loading && pokemonAmount === 0 && <h1>Create Character</h1>}</div>
  );
}
