import express from "express";
import next from "next";
import dayjs from "dayjs";
import { ApolloServer, gql } from "apollo-server-express";
import { typeDefs, resolvers } from "./schemas/index.js";

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app
  .prepare()
  .then(() => {
    const server = express();

    // Set up Apollo Server for GraphQL

    const apolloServer = new ApolloServer({
      typeDefs,
      resolvers,
    });

    async function startApolloServer() {
      await apolloServer.start();
      apolloServer.applyMiddleware({ app: server });
    }

    startApolloServer();

    server.get("*", (req, res) => {
      return handle(req, res);
    });

    const PORT = process.env.PORT || 3000;
    server.listen(PORT, (err) => {
      if (err) throw err;
      console.log(
        `[${dayjs().format(
          "MM/DD/YY hh:mm:ssA"
        )}] Now listening on http://localhost:${PORT}`
      );
    });
  })
  .catch((ex) => {
    console.error(ex.stack);
    process.exit(1);
  });
