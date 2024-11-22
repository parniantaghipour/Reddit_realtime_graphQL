const SimplePubSub = require('./simplePubSub');
const pubsub = new SimplePubSub();

const POSTS = []; // In-memory storage for posts

const resolvers = {
  Query: {
    posts: () => POSTS,
  },
  Mutation: {
    crawlPost: (_, { post }) => {
      POSTS.push(post);
      console.log('Publishing postAdded event:', post);
      pubsub.publish('POST_ADDED', { postAdded: post });
      return post;
    },
    deletePost: (_, { id }) => {
        const index = POSTS.findIndex((post) => post.id === id);
        if (index === -1) {
          throw new Error('Post not found');
        }
        const [deletedPost] = POSTS.splice(index, 1); // Remove post from array
        return deletedPost;
      },
  },
  Subscription: {
    postAdded: {
      subscribe: () => {
        console.log('Subscription established');
        return pubsub.asyncIterator('POST_ADDED');
      },
    },
  },
};

module.exports = resolvers;
