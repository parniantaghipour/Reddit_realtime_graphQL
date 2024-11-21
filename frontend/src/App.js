import React from 'react';
import { gql, useSubscription } from '@apollo/client';

const POST_ADDED_SUBSCRIPTION = gql`
  subscription {
    postAdded {
      id
      title
      url
      score
    }
  }
`;

function App() {
  const { data, loading } = useSubscription(POST_ADDED_SUBSCRIPTION);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1>Live Reddit Posts</h1>
      <ul>
        {data?.postAdded && (
          <li>
            <a href={data.postAdded.url}>{data.postAdded.title}</a> - Score: {data.postAdded.score}
          </li>
        )}
      </ul>
    </div>
  );
}

export default App;
