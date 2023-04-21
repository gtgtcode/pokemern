import mongoose from "mongoose";
import dayjs from "dayjs";
import * as dotenv from "dotenv";
dotenv.config();

const mongoConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`[${dayjs().format("MM/DD/YY hh:mmA")}] Connected to MongoDB!`);
  } catch (err) {
    console.error(`Error connecting to MongoDB: ${err}`);
  }
};

module.exports = { mongoConnection };
