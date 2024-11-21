const { ApolloServer } = require('apollo-server-express');
const { makeExecutableSchema } = require('@graphql-tools/schema');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import CORS
const { createServer } = require('http');
const { useServer } = require('graphql-ws/lib/use/ws');
const { WebSocketServer } = require('ws');
const typeDefs = require('./schema');
const resolvers = require('./resolvers');

// Create Express app
const app = express();

// Enable CORS for all routes
app.use(cors()); // Add CORS support

// Parse JSON payloads
app.use(bodyParser.json());

// Define the /crawl endpoint
app.post('/crawl', (req, res) => {
  resolvers.Mutation.crawlPost(null, { post: req.body });
  res.sendStatus(200);
});

// Create GraphQL schema
const schema = makeExecutableSchema({ typeDefs, resolvers });

// Create Apollo Server instance
const server = new ApolloServer({ schema });

// Create HTTP server for Express and WebSocket
const httpServer = createServer(app);

// WebSocket server for subscriptions
const wsServer = new WebSocketServer({
  server: httpServer,
  path: '/graphql',
});

// Use graphql-ws for subscriptions
useServer({ schema }, wsServer);

// Start the Apollo Server and apply middleware
(async () => {
  await server.start(); // Explicitly start the Apollo server
  server.applyMiddleware({ app });

  const PORT = 4000;
  httpServer.listen(PORT, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`);
    console.log(`🚀 Subscriptions ready at ws://localhost:${PORT}${server.graphqlPath}`);
  });
})();
