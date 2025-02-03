import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const PostDetailPage = () => {
  const { id } = useParams(); // Get the post ID from the URL
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id || isNaN(id)) {
      setError('Invalid post ID.');
      setLoading(false);
      return;
    }

    // Fetch the post details from the API
    const fetchPost = async () => {
  try {
    const response = await fetch(`https://barkatkamran.com/posts?id=${id}&method=GET_POST`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    setPost(data);
  } catch (err) {
    console.error('Fetch error:', err);
    setError(err.message);
  } finally {
    setLoading(false);
  }
};

    fetchPost();
  }, [id]);  // Re-run if the ID changes

  // Render loading state
  if (loading) return <div>Loading...</div>;

  // Render error state
  if (error) return <div>Error: {error}</div>;

  // Render the post details when available
  return (
    <div>
      {post ? (
        <>
          <h1>{post.title}</h1>
          <div>{post.content}</div>
          <img 
            src={post.imageUrl || 'https://via.placeholder.com/150'} 
            alt={post.title || 'Post Image'} 
          />
          <p>Posted on: {new Date(post.created_at).toLocaleDateString()}</p>
        </>
      ) : (
        <p>Post not found.</p> // Display if post data is empty
      )}
    </div>
  );
};

export default PostDetailPage;
