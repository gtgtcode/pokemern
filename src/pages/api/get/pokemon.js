import { mongoConnection } from "@/utils/connect";

const Pokemon = require("../../../models/Pokemon");

export default async function handler(req, res) {
  await mongoConnection();
  const pokemon = await Pokemon.find({});
  res.status(200).json(pokemon);
  console.log(await Pokemon.find({}));
}
