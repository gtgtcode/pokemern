import Image from "next/image";
import { Inter } from "next/font/google";
import { useState, useEffect } from "react";
import { gql, useQuery } from "@apollo/client";
import { client } from "./_app";
import Login from "./login";
import Register from "./register";
import Navbar from "./navbar";

const inter = Inter({ subsets: ["latin"] });

export async function getStaticProps() {
  const { data } = await client.query({
    query: POKEMON_GET,
  });

  return {
    props: {
      pokemon: data.pokemon,
    },
  };
}

const POKEMON_GET = gql`
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
  const { loading, error, data } = useQuery(POKEMON_GET);
  const [isAuthenticated, setAuthentication] = useState(false);

  return (
    <main>
      <Navbar />
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
            src={`${data.pokemon[0].sprites[1]}`}
            id="pokemon-image"
            alt="pokemon image"
            className="scale-[2]"
          />
        </div>
      )}
    </main>
  );
}
