import { mongoConnection } from "@/utils/connect";

const User = require("../../../models/User");
const Pokemon = require("../../../models/Pokemon");

export default async function handler(req, res) {
  await mongoConnection();
  const user = await User.deleteMany({});
  const pokemon = await Pokemon.deleteMany({});
  res.status(200).json(user + pokemon);
}
