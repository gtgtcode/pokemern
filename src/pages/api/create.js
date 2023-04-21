import { mongoConnection } from "@/utils/connect";
import mongoose from "mongoose";
import dayjs from "dayjs";

const User = require("../../models/User");

export default async function handler(req, res) {
  await mongoConnection();
  const user = await User.create(req.body);
  res.status(200).json(user);
}
