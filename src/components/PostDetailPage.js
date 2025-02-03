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
        
        if (!response.ok) {
          throw new Error('Failed to fetch post');
        }

        const data = await response.json();

        // Handle API response and set state
        if (data) {
          setPost(data);
        } else {
          throw new Error('Post not found');
        }
      } catch (err) {
        console.error('Error fetching post:', err);
        setError(err.message); // Set error state for display
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
          {/* Render image with a fallback if the image URL is missing */}
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
