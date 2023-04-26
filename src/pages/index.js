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

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    }
  }, [router]);

  return (
    <main>
      <Navbar />
      <CreateCharacter />
    </main>
  );
}
