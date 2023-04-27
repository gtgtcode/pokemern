import React, { useState, useEffect } from "react";
import { gql, useQuery } from "@apollo/client";
import Image from "next/image";

const USER_INFO = gql`
  query getUserInfo($id: ID!) {
    userById(id: $id) {
      id
      username
      money
      gender
      pokemon {
        name
        level
      }
    }
  }
`;

const TrainerCard = () => {
  const [userId, setUserId] = useState(null);
  const [pokemonAmount, setPokemonAmount] = useState(null);

  const { loading, error, data } = useQuery(USER_INFO, {
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
      console.log(data.userById);
      console.log(pokemonCount);

      setPokemonAmount(pokemonCount); // Set pokemonAmount to the fetched pokemon count
    };

    fetchData();
  }, [loading, error, data]);

  return (
    <div className="float-right mr-10 mt-10 min-h-[150px] min-w-[200px] rounded-[40px] bg-gray-200 p-4">
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error: {error.message}</p>
      ) : (
        <>
          <h1 id="username" className="pl-6">
            {data && data.userById && data.userById.username}
          </h1>
          <Image
            src={
              data && data.userById && data.userById.gender == 0
                ? "/boy-sprite.png"
                : "/girl-sprite.png"
            }
            alt="Pokemon character sprite"
            height="100"
            width="100"
            className="mx-auto"
          />
          <div id="divider" className="my-4 h-[2px] w-full">
            <div className="h-full w-full bg-gray-300"></div>
          </div>
          <p id="money" className="mt-2 pl-6">
            ₽ {data && data.userById && data.userById.money}
          </p>
        </>
      )}
    </div>
  );
};

export default TrainerCard;
