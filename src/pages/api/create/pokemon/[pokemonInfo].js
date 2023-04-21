import { mongoConnection } from "@/utils/connect";

const Pokemon = require("../../../../models/Pokemon");

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

    const pokemon = Pokemon.create({
      name: data.name,
      types: data.types,
      sprites: data.sprites,
      level: 5,
      xp: 0,
      health: data.stats[0].base_stat,
      moveset: [data.moves[0], data.moves[1]],
      fullMoveset: data.moves,
      attack: data.stats[1].base_stat,
      defense: data.stats[2].base_stat,
      speed: data.stats[5].base_stat,
    });

    res.status(200).json(pokemon);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
