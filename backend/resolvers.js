const { PubSub } = require('graphql-subscriptions');
const pubsub = new PubSub();

const POSTS = []; // In-memory storage

const resolvers = {
  Query: {
    posts: () => POSTS,
  },
  Subscription: {
    postAdded: {
      subscribe: () => pubsub.asyncIterator(['POST_ADDED']),
    },
  },
  Mutation: {
    crawlPost: (_, { post }) => {
      POSTS.push(post);
      pubsub.publish('POST_ADDED', { postAdded: post });
      return post;
    },
  },
};

module.exports = resolvers;
