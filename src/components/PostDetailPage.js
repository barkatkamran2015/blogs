import React, { useState, useEffect } from 'react';

const API_URL = 'https://barkatkamran.com/db.php';

const PostDetailPage = () => {
  const [post, setPost] = useState(null); // Post data
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(''); // Error state

  // Get the post ID from URL query parameters
  const urlParams = new URLSearchParams(window.location.search);
  const postId = urlParams.get('id');

  useEffect(() => {
    const fetchPostDetails = async () => {
      try {
        if (!postId) {
          setError('Post ID is missing in the URL.');
          setLoading(false);
          return;
        }

        setLoading(true);
        const response = await fetch(`${API_URL}?method=GET_POST&id=${postId}`);
        if (!response.ok) throw new Error('Failed to fetch post details');

        const data = await response.json();
        const formattedPost = {
          ...data,
          titleStyle: data.titleStyle ? JSON.parse(data.titleStyle) : { color: '#000', fontSize: '2rem', textAlign: 'center' },
        };

        setPost(formattedPost);
      } catch (err) {
        console.error('Error fetching post details:', err);
        setError('Failed to load post details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchPostDetails();
  }, [postId]);

  return (
    <div className="post-detail-page">
      {/* Loading and Error States */}
      {loading ? (
        <div className="loading-container">
          <div className="heart-loader"></div>
        </div>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : (
        post && (
          <div className="post-detail-container">
            {/* Post Image */}
            {post.imageUrl && (
              <img src={post.imageUrl} alt={post.title} className="post-detail-image" />
            )}

            {/* Post Content */}
            <h1
              className="post-detail-title"
              style={{
                color: post.titleStyle?.color || '#333',
                fontSize: post.titleStyle?.fontSize || '2rem',
                textAlign: post.titleStyle?.textAlign || 'center',
              }}
            >
              {post.title}
            </h1>

            {/* Post Date */}
            {post.created_at ? (
              <p className="post-detail-date">
                Posted on: {new Date(post.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            ) : (
              <p className="post-detail-date">Date not available</p>
            )}

            {/* Post Content */}
            <div
              className="post-detail-content"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>
        )
      )}
    </div>
  );
};

export default PostDetailPage;
