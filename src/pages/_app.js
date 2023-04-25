import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client";
import "../styles/globals.css";

// Set the API URL based on the environment.
const isDevelopment = process.env.NODE_ENV === "development";
const API_URL = isDevelopment
  ? "http://localhost:3000"
  : "https://pokemern.vercel.app";

const client = new ApolloClient({
  uri: API_URL + "/api/graphql",
  cache: new InMemoryCache(),
});

export default function App({ Component, pageProps }) {
  return (
    <ApolloProvider client={client}>
      <Component {...pageProps} />
    </ApolloProvider>
  );
}

// Export the client instance
export { client };
