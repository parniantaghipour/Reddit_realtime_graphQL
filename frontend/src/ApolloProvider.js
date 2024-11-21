import React from 'react';
import { ApolloClient, InMemoryCache, ApolloProvider, split } from '@apollo/client';
import { WebSocketLink } from '@apollo/client/link/ws';
import { HttpLink } from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';

// Define the HTTP link for queries and mutations
const httpLink = new HttpLink({ uri: 'http://localhost:4000/graphql' });

// Define the WebSocket link for subscriptions
const wsLink = new WebSocketLink({
  uri: 'ws://localhost:4000/graphql',
  options: { reconnect: true },
});

// Split based on operation type (query/mutation vs. subscription)
const link = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return definition.kind === 'OperationDefinition' && definition.operation === 'subscription';
  },
  wsLink,
  httpLink
);

// Create Apollo Client
const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
});

// Apollo Provider Wrapper
const ApolloProviderWrapper = ({ children }) => (
  <ApolloProvider client={client}>{children}</ApolloProvider>
);

export default ApolloProviderWrapper;
