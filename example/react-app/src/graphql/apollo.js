import { ApolloClient, HttpLink, InMemoryCache, split } from "@apollo/client";
import { getMainDefinition } from "@apollo/client/utilities";

import WebSocketLink from "./WebSocketLink";

const wsLink = new WebSocketLink({
  url: process.env.REACT_APP_SUBSCRIPTIONS_API_URL,
  connectionParams: () => {
    // simulate an auth token sent from the client over the WS connection
    const token = "some-token";
    return { ...(token && { token }) };
  }
});

const httpLink = new HttpLink({
  uri: process.env.REACT_APP_GATEWAY_API_URL
});

const link = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  httpLink
);

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link
});

export default client;
