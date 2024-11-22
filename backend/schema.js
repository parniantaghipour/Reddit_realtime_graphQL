const { gql } = require('apollo-server');

const typeDefs = gql`
  type Post {
    id: ID!
    title: String!
    url: String
    score: Int
    createdAt: String
  }

  type Query {
    posts: [Post!]!
  }

  type Mutation {
    crawlPost(post: PostInput!): Post
    deletePost(id: ID!): Post
  }

  input PostInput {
    id: ID!
    title: String!
    url: String
    score: Int
    createdAt: String
  }

  type Subscription {
    postAdded: Post!
  }
`;

module.exports = typeDefs;
