import Pokedex from "pokedex-promise-v2";
const P = new Pokedex();

const resolvers = {
  Query: {
    pokemon: async (parent, { name }, context, info) => {
      try {
        const pokemonData = await P.getPokemonByName(name);
        const { id, name: pokemonName, types, height, weight } = pokemonData;
        return { id, name: pokemonName, types, height, weight };
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
  },
};

export { resolvers };
