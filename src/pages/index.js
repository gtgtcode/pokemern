import Image from "next/image";
import { Inter } from "next/font/google";
import { useState } from "react";
import { gql, useQuery } from "@apollo/client";
import { client } from "./_app";

const inter = Inter({ subsets: ["latin"] });

export async function getStaticProps() {
  const { data } = await client.query({
    query: POKEMON_SPRITE,
  });

  return {
    props: {
      pokemon: data.pokemon,
    },
  };
}

const POKEMON_SPRITE = gql`
  query getPokemon {
    pokemon {
      name
      sprites
      id
    }
  }
`;

export default function Home() {
  const [showPokemon, setPokemon] = useState(false);
  const { loading, error, data } = useQuery(POKEMON_SPRITE);

  const printData = JSON.stringify(data);
  console.log(printData);

  return (
    <main>
      <button
        onClick={() => {
          setPokemon(!showPokemon);
        }}
      >
        Pokemon Toggle
      </button>
      {showPokemon && (
        <div>
          <img
            src={`${data.pokemon[1].sprites[1]}`}
            alt="pokemon image"
            className="scale-150"
          />
        </div>
      )}
    </main>
  );
}
