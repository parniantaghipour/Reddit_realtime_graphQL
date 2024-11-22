const { ApolloServer } = require('apollo-server-express');
const { makeExecutableSchema } = require('@graphql-tools/schema');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { createServer } = require('http');
const { useServer } = require('graphql-ws/lib/use/ws');
const { WebSocketServer } = require('ws');
const typeDefs = require('./schema');
const resolvers = require('./resolvers');

// Initialize Express app
const app = express();
app.use(cors());
app.use(bodyParser.json());

// Create GraphQL schema
const schema = makeExecutableSchema({ typeDefs, resolvers });

// Create Apollo Server instance
const server = new ApolloServer({ schema });

// Create HTTP server for Express and WebSocket
const httpServer = createServer(app);

// Set up WebSocket server using graphql-ws
const wsServer = new WebSocketServer({
  server: httpServer,
  path: '/graphql',
});
app.post('/crawl', (req, res) => {
    console.log('Data received from crawler:', req.body); // Log the received data
    resolvers.Mutation.crawlPost(null, { post: req.body }); // Call the mutation
    res.sendStatus(200);
  });

useServer(
  {
    schema,
    onConnect: (ctx) => {
      console.log('WebSocket connected:', ctx.connectionParams);
    },
    onDisconnect: () => {
      console.log('WebSocket disconnected');
    },
  },
  wsServer
);

// Start Apollo Server and apply middleware
(async () => {
  await server.start();
  server.applyMiddleware({ app });

  const PORT = 4000;
  httpServer.listen(PORT, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`);
    console.log(`🚀 Subscriptions ready at ws://localhost:${PORT}${server.graphqlPath}`);
  });
})();
