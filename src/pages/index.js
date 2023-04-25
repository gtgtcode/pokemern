import Image from "next/image";
import { Inter } from "next/font/google";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { gql, useQuery } from "@apollo/client";
import { client } from "./_app";
import Login from "./login";
import Register from "./register";
import Navbar from "./components/navbar";
import CreateCharacter from "./components/createCharacter";

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
  const router = useRouter();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    }
  }, [router]);
  const [showPokemon, setPokemon] = useState(false);
  const { loading, error, data } = useQuery(POKEMON_GET);

  return (
    <main>
      <Navbar />
      <CreateCharacter />
    </main>
  );
}
