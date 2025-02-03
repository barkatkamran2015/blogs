import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const PostDetailPage = () => {
  const { id } = useParams(); // Get post ID from URL
  const postId = Number(id) || parseInt(id, 10); // Ensure it's a valid number

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!postId) {
      setError('Invalid post ID.');
      setLoading(false);
      return;
    }

    const controller = new AbortController(); // Create an abort controller for cleanup

    const fetchPost = async () => {
      try {
        const response = await fetch(`https://barkatkamran.com/api/posts/${postId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          signal: controller.signal, // Attach the abort signal
        });

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Post not found.');
          }
          if (response.status === 500) {
            throw new Error('Server error. Please try again later.');
          }
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        setPost(data);
      } catch (err) {
        if (err.name === 'AbortError') return; // Ignore aborted requests
        console.error('Fetch error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();

    return () => controller.abort(); // Cleanup: Abort fetch on unmount
  }, [postId]);

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
