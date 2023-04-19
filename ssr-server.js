import express from "express";
import next from "next";
import dayjs from "dayjs";
import { ApolloServer, gql } from "apollo-server-express";
import session from "express-session";
import { typeDefs, resolvers } from "./schemas/index.js";

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app
  .prepare()
  .then(() => {
    const server = express();

    // Set up session middleware for user authentication
    server.use(
      session({
        secret: "my-secret",
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false },
      })
    );

    // Set up Apollo Server for GraphQL
    const apolloServer = new ApolloServer({
      typeDefs,
      resolvers,
      context: ({ req }) => {
        // Pass session object to resolvers
        const session = req.session;
        return { session };
      },
    });

    async function startApolloServer() {
      await apolloServer.start();
      apolloServer.applyMiddleware({ app: server });
    }

    startApolloServer();

    server.get("/login", (req, res) => {
      // Log user in
      test = req.session.user || "Not signed in yet.";
      req.session.user = { name: "John Doe", email: "johndoe@example.com" };
      res.send(test + "Logged in as " + req.session.user.name);
      console.log("Logged in as " + req.session.user.name);
    });

    server.get("/logout", (req, res) => {
      // Log user out
      req.session.destroy((err) => {
        if (err) {
          console.log(err);
        } else {
          res.send("Logged out");
        }
      });
    });

    server.get("*", (req, res) => {
      return handle(req, res);
    });

    const PORT = process.env.PORT || 3000;
    server.listen(PORT, (err) => {
      if (err) throw err;
      console.log(
        `[${dayjs().format(
          "MM/DD/YY hh:mm:ssA"
        )}] Now listening on http://localhost:${PORT}/`
      );
    });
  })
  .catch((ex) => {
    console.error(ex.stack);
    process.exit(1);
  });
