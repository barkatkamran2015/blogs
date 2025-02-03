import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const PostDetailPage = () => {
  const { id } = useParams();  // Get the post ID from the URL
  const [post, setPost] = useState(null);

  useEffect(() => {
    // Fetch the post data based on the id from your API
    fetch(`/api/posts/${id}`)  // Adjust the API endpoint as needed
      .then((response) => response.json())
      .then((data) => setPost(data))
      .catch((error) => console.error("Error fetching post:", error));
  }, [id]);

  if (!post) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
    </div>
  );
};

export default PostDetailPage;
