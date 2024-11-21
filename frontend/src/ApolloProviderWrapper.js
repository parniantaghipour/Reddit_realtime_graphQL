import React from 'react';
import { ApolloClient, InMemoryCache, ApolloProvider, split } from '@apollo/client';
import { HttpLink } from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';
import { createClient } from 'graphql-ws';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';

// Define the HTTP link for queries and mutations
const httpLink = new HttpLink({ uri: 'http://localhost:4000/graphql' });

// Define the WebSocket link for subscriptions using graphql-ws
const wsLink = new GraphQLWsLink(
  createClient({
    url: 'ws://localhost:4000/graphql',
    options: {
      reconnect: true, // Automatically reconnect on disconnect
    },
  })
);

// Split the links: Use WebSocket for subscriptions, HTTP for queries/mutations
const link = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return definition.kind === 'OperationDefinition' && definition.operation === 'subscription';
  },
  wsLink,
  httpLink
);

// Create the Apollo Client
const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
});

// Apollo Provider Wrapper
const ApolloProviderWrapper = ({ children }) => (
  <ApolloProvider client={client}>{children}</ApolloProvider>
);

export default ApolloProviderWrapper;
