import { gql } from "apollo-server-express";

const typeDefs = gql`
  type Type {
    name: String!
    url: String!
  }

  type Pokemon {
    id: Int!
    name: String!
    types: [Type!]!
    height: Float!
    weight: Float!
  }

  type Query {
    pokemon(name: String!): Pokemon
  }
`;
export { typeDefs };
