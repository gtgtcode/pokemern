const { createYoga, createSchema } = require("graphql-yoga");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
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
        pokemon: String!
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
      moveset: [MoveInput]
      fullMoveset: [FullMoveInput]
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
        pokemon: [PokemonInput]
        pc: [String]
        money: Int
        items: [String]
        badges: [String]
        gender: Int
      ): User!
    addStarterPokemon(id: ID!, pokemon: String!): User!
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
  flavor_text: String
  stat_changes: [StatChangeInput]
  current_pp: Int
  max_pp: Int
}

input StatChangeInput {
    change: Int
    stat: [StatValueInput]
  }

  input StatValueInput {
    name: String
    url: String
  }

type Move {
  name: String!
  type: String
  flavor_text: String
  stat_changes: [StatChange]
  power: Int
  accuracy: Int
  current_pp: Int
  max_pp: Int
}

type StatChange {
    change: Int
    stat: [StatValue]
  }

  
type StatValue {
    name: String
    url: String
  }

input FullMoveInput {
    name: String!
    url: String!
    level_learned_at: Int
  }
  
  type FullMove {
    name: String!
    url: String!
    level_learned_at: Int
  }

  input PokemonInput {
    id: ID!
    name: String!
    types: [String]!
    sprites: [String]!
    level: Int!
    xp: Int!
    max_xp: Int!
    health: Int!
    max_health: Int!
    moveset: [MoveInput]!
    fullMoveset: [FullMoveInput]!
    attack: Int!
    defense: Int!
    speed: Int!
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
  moveset: [Move]!
  fullMoveset: [FullMove]!
  attack: Int!
  defense: Int!
  speed: Int!
}

type Moveset {
  moves: Move
}

type User {
  id: ID!
  username: String!
  email: String!
  createdAt: Date!
  pokemon: [Pokemon]
  money: Int!
  items: [String]!
  pc: [String]!
  badges: [String]!
  gender: Int!
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
    async userById(parent, args, context, info) {
      const user = await User.findById(args.id);
      if (!user) {
        throw new Error("User not found");
      }
      return user;
    },
  },
  Mutation: {
    async createPokemon(parent, args, context, info) {
      try {
        const pokemonName = JSON.stringify(args.pokemon);
        const nameWithoutQuotes = pokemonName.replace(/['"]+/g, "");
        const pokeRes = await fetch(
          `https://pokeapi.co/api/v2/pokemon/${nameWithoutQuotes}/`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const data = await pokeRes.json();

        let pokeTypes = [];
        let pokeLevel = 5;
        let pokeMoveset = {};

        for (let i = 0; i < data.types.length; i++) {
          pokeTypes.push(data.types[i].type.name);
        }

        let pokeSprites = [];
        pokeSprites.push(
          data.sprites.versions[`generation-v`][`black-white`].animated
            .back_default
        );
        pokeSprites.push(
          data.sprites.versions[`generation-v`][`black-white`].animated
            .front_default
        );
        let pokeMoves = data.moves
          .filter((move) =>
            move.version_group_details.some(
              (detail) => detail.move_learn_method.name === "level-up"
            )
          )
          .sort(
            (a, b) =>
              a.version_group_details.find(
                (detail) => detail.move_learn_method.name === "level-up"
              ).level_learned_at -
              b.version_group_details.find(
                (detail) => detail.move_learn_method.name === "level-up"
              ).level_learned_at
          );

        for (let i = 0; i < pokeMoves.length; i++) {
          if (
            pokeMoves[i].version_group_details.length > 0 &&
            pokeMoves[i].version_group_details[0].move_learn_method.name ===
              "level-up" &&
            pokeMoves[i].version_group_details[0].level_learned_at <= pokeLevel
          ) {
            let moveRes = await fetch(pokeMoves[i].move.url, {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            });
            const moveData = await moveRes.json();

            let flavorText = "";
            for (let j = 0; j < moveData.flavor_text_entries.length; j++) {
              if (moveData.flavor_text_entries[j].language.name === "en") {
                flavorText = moveData.flavor_text_entries[j].flavor_text;
                break;
              }
            }

            let statChangesArr = [];
            console.log(moveData.stat_changes.length);
            if (moveData.stat_changes.length == 0) {
              console.log("EMPTY");
              let emptyStatChange = {
                change: 0,
                stat: [
                  {
                    name: "a",
                    url: "a",
                  },
                ],
              };
              statChangesArr.push(emptyStatChange);
            }
            for (let k = 0; k < moveData.stat_changes.length; k++) {
              moveData.stat_changes[k] = {
                change: moveData.stat_changes[k].change || 0,
                stat: {
                  name: moveData.stat_changes[k].stat.name || "a",
                  url: moveData.stat_changes[k].stat.url || "a",
                },
              };
              let statChangeObj = {
                change: moveData.stat_changes[k].change || 0,
                stat: [
                  {
                    name: moveData.stat_changes[k].stat.name || "a",
                    url: moveData.stat_changes[k].stat.url || "a",
                  },
                ],
              };

              statChangesArr.push(statChangeObj);
            }

            pokeMoveset[pokeMoves[i].move.name] = {
              url: pokeMoves[i].move.url,
              name: pokeMoves[i].move.name,
              level_learned_at:
                pokeMoves[i].version_group_details[0].level_learned_at,
              max_pp: moveData.pp,
              current_pp: moveData.pp,
              accuracy: moveData.accuracy,
              power: moveData.power,
              flavor_text: flavorText,
              stat_changes: statChangesArr,
              type: moveData.type.name,
            };
          }
        }

        const pokemon = await Pokemon.create({
          name: data.name,
          types: pokeTypes,
          sprites: pokeSprites,
          level: pokeLevel,
          xp: 0,
          max_xp: 100,
          health: data.stats[0].base_stat,
          max_health: data.stats[0].base_stat,
          moveset: pokeMoveset,
          fullMoveset: pokeMoves,
          attack: data.stats[1].base_stat,
          defense: data.stats[2].base_stat,
          speed: data.stats[5].base_stat,
        });
        await pokemon.save();
        return pokemon;
      } catch (err) {
        console.error(err);
      }
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
    async updateUser(parent, args, context, info) {
      const { id, ...updates } = args;
      const options = { new: true };
      return await User.findByIdAndUpdate(
        id,
        { $set: { ...updates } },
        options
      );
    },
  },
  Pokemon: {
    async moveset(parent, args, context, info) {
      const moves = Object.values(parent.moveset);
      return moves;
    },
    async fullMoveset(parent, args, context, info) {
      const moves = parent.fullMoveset.map((move) => ({
        name: move.move.name,
        url: move.move.url,
        level_learned_at:
          move.version_group_details[0]?.level_learned_at || null,
      }));
      return moves;
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
