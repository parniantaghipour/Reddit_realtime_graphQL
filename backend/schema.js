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

  type Subscription {
    postAdded: Post!
  }

  type Mutation {
    crawlPost(post: PostInput!): Post
  }

  input PostInput {
    id: ID!
    title: String!
    url: String
    score: Int
    createdAt: String
  }
`;

module.exports = typeDefs;
