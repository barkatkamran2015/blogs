import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const PostDetailPage = () => {
  const { id } = useParams(); // Get the post ID from the URL
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch the post details from the API
    const fetchPost = async () => {
      try {
        const response = await fetch(`https://your-api-endpoint.com/posts?id=${id}&method=GET_POST`);
        const data = await response.json();
        
        if (response.ok) {
          setPost(data);  // Set post data
        } else {
          throw new Error(data.message || 'Failed to fetch post');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);  // Re-run if the ID changes

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {post ? (
        <>
          <h1>{post.title}</h1>
          <div>{post.content}</div>
          <img src={post.imageUrl} alt={post.title} />
          <p>Posted on: {post.created_at}</p>
        </>
      ) : (
        <p>Post not found.</p>
      )}
    </div>
  );
};

export default PostDetailPage;
