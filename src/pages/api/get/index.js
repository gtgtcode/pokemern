import { mongoConnection } from "@/utils/connect";

const User = require("../../../models/User");

export default async function handler(req, res) {
  await mongoConnection();
  const user = await User.find({});
  res.status(200).json(user);
}
