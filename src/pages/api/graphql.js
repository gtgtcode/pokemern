const { createYoga, createSchema } = require("graphql-yoga");
const Pokemon = require("../../models/Pokemon");
const User = require("../../models/User");
import { mongoConnection } from "@/utils/connect";

async function mongoServer() {
  await mongoConnection();
}

mongoServer();

const typeDefs = `
scalar Date

type Query {
  pokemon: [Pokemon!]!
  pokemonById(id: ID!): Pokemon
  users: [User!]!
  userById(id: ID!): User
}

type Mutation {
    createPokemon(
      name: String!
      types: [String]!
      sprites: [String]!
      level: Int
      xp: Int
      max_xp: Int
      health: Int
      max_health: Int
      moveset: MovesetInput
      fullMoveset: [MoveInput]!
      attack: Int
      defense: Int
      speed: Int
    ): Pokemon!
    updatePokemon(
      id: ID!
      name: String
      types: [String]
      sprites: [String]
      level: Int
      xp: Int
      max_xp: Int
      health: Int
      max_health: Int
      moveset: MovesetInput
      fullMoveset: [MoveInput]
      attack: Int
      defense: Int
      speed: Int
    ): Pokemon!
    deletePokemon(id: ID!): ID!
    createUser(
      username: String!
      email: String!
      password: String!
    ): User!
    updateUser(
      id: ID!
      username: String
      email: String
      password: String
    ): User!
    deleteUser(id: ID!): ID!
    register(
      username: String!
      email: String!
      password: String!
    ): AuthPayload!
    login(username: String!, password: String!): AuthPayload!
  }
  
  type AuthPayload {
    token: String!
    user: User!
  }
  

input MovesetInput {
  move1: String
  move2: String
  move3: String
  move4: String
}

input MoveInput {
  name: String!
  type: String!
  power: Int
  accuracy: Int
}

type Move {
  name: String!
  type: String!
  power: Int
  accuracy: Int
}

type Pokemon {
  id: ID!
  name: String!
  types: [String]!
  sprites: [String]!
  level: Int!
  xp: Int!
  max_xp: Int!
  health: Int!
  max_health: Int!
  moveset: Moveset!
  fullMoveset: [Move]!
  attack: Int!
  defense: Int!
  speed: Int!
  createdAt: Date!
  updatedAt: Date!
}

type Moveset {
  move1: Move
  move2: Move
  move3: Move
  move4: Move
}

type User {
  id: ID!
  username: String!
  email: String!
  createdAt: Date!
  pokemon: [String]!
  money: Int!
  items: [String]!
}

`;

const resolvers = {
  Query: {
    async pokemon() {
      return await Pokemon.find({});
    },
    async pokemonById(parent, args, context, info) {
      return await Pokemon.findById(args.id);
    },
    async users() {
      return await User.find({});
    },
    async userById(parent, args, { currentUser }, info) {
      if (!currentUser) {
        throw new Error("Authentication required");
      }
      const user = await User.findById(currentUser.id);
      if (!user) {
        throw new Error("User not found");
      }
      return user;
    },
  },
  Mutation: {
    async createPokemon(parent, args, context, info) {
      const pokemon = new Pokemon(args);
      await pokemon.save();
      return pokemon;
    },
    async updatePokemon(parent, args, context, info) {
      const { id, ...updates } = args;
      const options = { new: true };
      return await Pokemon.findByIdAndUpdate(id, updates, options);
    },
    async deletePokemon(parent, args, context, info) {
      await Pokemon.findByIdAndRemove(args.id);
      return args.id;
    },
    async register(parent, { username, email, password }, context, info) {
      const existingUser = await User.findOne({
        $or: [{ email }, { username }],
      });
      if (existingUser) {
        throw new Error("User already exists with that email or username");
      }
      const user = new User({ username, email, password });
      await user.save();
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      return { token, user };
    },
    async login(parent, { username, password }, context, info) {
      const user = await User.findOne({ username });
      if (!user) {
        throw new Error("User not found");
      }
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        throw new Error("Invalid password");
      }
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      return { token, user };
    },
  },
  Pokemon: {
    async moveset(parent, args, context, info) {
      const moves = [];
      const { move1, move2, move3, move4 } = parent.moveset;
      if (move1) moves.push(await fetchMove(move1));
      if (move2) moves.push(await fetchMove(move2));
      if (move3) moves.push(await fetchMove(move3));
      if (move4) moves.push(await fetchMove(move4));
      return moves;
    },
    async fullMoveset(parent, args, context, info) {
      const moveset = parent.fullMoveset;
      const moveIds = Object.values(moveset);
      const moves = await Promise.all(moveIds.map(fetchMove));
      const orderedMoves = moveIds.map((id) =>
        moves.find((move) => move.id === id)
      );
      return Object.fromEntries(
        Object.entries(moveset).map(([key], i) => [key, orderedMoves[i]])
      );
    },
  },
};

const schema = createSchema({
  typeDefs,
  resolvers,
});

export const config = {
  api: {
    // Disable body parsing (required for file uploads)
    bodyParser: false,
  },
};

export default createYoga({
  schema,
  // Needed to be defined explicitly because our endpoint lives at a different path other than `/graphql`
  graphqlEndpoint: "/api/graphql",
});
