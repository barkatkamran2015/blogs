import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../PostDetailPage.css';

// Helper function to validate color
const isValidColor = (color) => {
  const style = new Option().style;
  style.backgroundColor = color;
  return style.backgroundColor !== '';
};

const PostDetailPage = () => {
  const { id } = useParams();
  const postId = Number(id);
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!postId || isNaN(postId)) {
      setError('Invalid post ID');
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    const fetchPost = async () => {
      try {
        const response = await fetch(
          `https://www.barkatkamran.com/db.php?method=GET_POST&id=${postId}`,
          {
            signal: controller.signal,
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const data = await response.json();
        
        // Validate background color
        if (data.backgroundColor && !isValidColor(data.backgroundColor)) {
          console.warn(`Invalid background color: ${data.backgroundColor}`);
          delete data.backgroundColor;
        }

        setPost(data);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPost();

    return () => controller.abort();
  }, [postId]);

  const backgroundColor = post?.backgroundColor || '#fafafa';

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div 
      className="post-detail-container" 
      style={{ 
        backgroundColor,
        // Ensure fallback works with CSS variables
        '--bg-color': isValidColor(backgroundColor) ? backgroundColor : '#fafafa'
      }}
    >
      {/* ... rest of your component ... */}
    </div>
  );
};

export default PostDetailPage;
