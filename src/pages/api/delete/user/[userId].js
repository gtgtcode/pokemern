import { mongoConnection } from "@/utils/connect";

const User = require("../../../../models/User");

export default async function handler(req, res) {
  const { userId } = req.query;
  await mongoConnection();
  const user = await User.findByIdAndRemove(userId);
  res.status(200).json(user);
}
