import './styles.css';

import React, { useState, useEffect } from 'react';
import { gql, useQuery, useMutation, useSubscription } from '@apollo/client';

// GraphQL query to fetch existing posts
const GET_POSTS = gql`
  query {
    posts {
      id
      title
      url
    }
  }
`;

// GraphQL subscription for new posts
const POST_ADDED_SUBSCRIPTION = gql`
  subscription {
    postAdded {
      id
      title
      url
    }
  }
`;

// GraphQL mutation to delete a post
const DELETE_POST = gql`
  mutation DeletePost($id: ID!) {
    deletePost(id: $id) {
      id
    }
  }
`;

const App = () => {
  const [allPosts, setAllPosts] = useState([]); // State to manage posts

  // Fetch existing posts
  const { data: queryData, loading: queryLoading, error: queryError } = useQuery(GET_POSTS);

  // Subscribe to new posts
  const { data: subscriptionData } = useSubscription(POST_ADDED_SUBSCRIPTION);

  // Mutation for deleting a post
  const [deletePost] = useMutation(DELETE_POST);

  // Update posts when the query fetches data
  useEffect(() => {
    if (queryData) {
      setAllPosts(queryData.posts); // Set existing posts
    }
  }, [queryData]);

  // Add new posts to the list when a subscription event occurs
  useEffect(() => {
    if (subscriptionData) {
      setAllPosts((prevPosts) => [...prevPosts, subscriptionData.postAdded]);
    }
  }, [subscriptionData]);

  // Handle Delete Button Click
  const handleDelete = async (id) => {
    try {
      await deletePost({ variables: { id } }); // Call delete mutation
      setAllPosts((prevPosts) => prevPosts.filter((post) => post.id !== id)); // Remove from state
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  if (queryLoading) return <p>Loading posts...</p>;
  if (queryError) return <p>Error fetching posts: {queryError.message}</p>;

  return (
    <div className="container">
      <h1>Live Reddit Posts</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>URL</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {allPosts.map((post) => (
            <tr key={post.id}>
              <td>{post.id}</td>
              <td>{post.title}</td>
              <td>
                <a href={post.url} target="_blank" rel="noopener noreferrer">
                  Visit
                </a>
              </td>
              <td>
                <button onClick={() => handleDelete(post.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default App;
