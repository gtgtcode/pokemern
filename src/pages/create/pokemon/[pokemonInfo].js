import { mongoConnection } from "@/utils/connect";

const Pokemon = require("../../../models/Pokemon");

export default async function handler(req, res) {
  const { pokemonInfo } = req.query;

  try {
    const pokeRes = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${pokemonInfo}/`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const data = await pokeRes.json();

    await mongoConnection(); // establish database connection here

    res.status(200).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
