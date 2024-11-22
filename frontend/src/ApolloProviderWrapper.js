import { ApolloClient, InMemoryCache, ApolloProvider, split } from '@apollo/client';
import { HttpLink } from '@apollo/client';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import { getMainDefinition } from '@apollo/client/utilities';

// HTTP Link for queries and mutations
const httpLink = new HttpLink({ uri: 'http://localhost:4000/graphql' });

// WebSocket Link for subscriptions
const wsLink = new GraphQLWsLink(
  createClient({
    url: 'ws://localhost:4000/graphql',
    options: {
      reconnect: true,
    },
  })
);

// Split links: Use WebSocket for subscriptions, HTTP for queries/mutations
const link = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return definition.kind === 'OperationDefinition' && definition.operation === 'subscription';
  },
  wsLink,
  httpLink
);

// Initialize Apollo Client
const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
});

// Wrap your app in ApolloProvider
const ApolloProviderWrapper = ({ children }) => (
  <ApolloProvider client={client}>{children}</ApolloProvider>
);

export default ApolloProviderWrapper;
