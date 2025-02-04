import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom'; // To handle query parameters
import Header from '../components/Header'; // Import Header component
import '../ProductsReview.css'; // Custom CSS for Products Review page

const API_URL = 'https://barkatkamran.com/db.php'; // Your backend API endpoint

const ProductsReview = () => {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [comments, setComments] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newComments, setNewComments] = useState({}); // Store individual comment inputs by post ID

  const location = useLocation(); // To get query parameters
  const queryParams = new URLSearchParams(location.search);
  const postIdFromQuery = queryParams.get('id'); // Extract `id` from query parameters

  // Fetch all posts for the "Products Review" page
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);

        const response = await fetch(`${API_URL}?page=Products Review`);
        if (!response.ok) throw new Error(`HTTP Error! Status: ${response.status}`);

        const data = await response.json();

        const productsReviewPosts = data
          .filter((post) => post.page === 'Products Review')
          .map((post) => ({
            ...post,
            titleStyle: post.titleStyle
              ? JSON.parse(post.titleStyle)
              : { color: '#000', fontSize: '1.5rem', textAlign: 'left' },
          }));

        setPosts(productsReviewPosts);
        setFilteredPosts(productsReviewPosts);

        if (postIdFromQuery) {
          setTimeout(() => {
            const element = document.getElementById(`post-${postIdFromQuery}`);
            if (element) {
              element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }, 500);
        }
      } catch (err) {
        setError('Failed to load posts. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [postIdFromQuery]);

  // Fetch comments for a specific post
  const fetchComments = async (postId) => {
    try {
      console.log(`Fetching comments for post ID: ${postId}`); // Log the post ID
      const response = await fetch(`${API_URL}?method=GET_COMMENTS&post_id=${postId}`);
      if (!response.ok) throw new Error('Failed to fetch comments.');
  
      const data = await response.json();
      console.log(`Fetched comments for post ID ${postId}:`, data); // Log fetched comments
      setComments((prev) => ({ ...prev, [postId]: data }));
    } catch (err) {
      console.error(`Error fetching comments for post ID ${postId}:`, err);
    }
  };
  
  // Fetch comments for all posts
  useEffect(() => {
    posts.forEach((post) => fetchComments(post.id));
  }, [posts]);

  // Handle adding a new comment
  const handleAddComment = async (postId) => {
    const comment = newComments[postId]?.trim();
    if (!comment) return;

    try {
      const response = await fetch(`${API_URL}?method=ADD_COMMENT`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ post_id: postId, content: comment }),
      });

      if (!response.ok) throw new Error('Failed to add comment.');

      const responseData = await response.json(); // Parse response to get random author
      alert(`Your comment has been posted as: ${responseData.author}`); // Optional: Notify user of assigned username

      // Refresh comments and clear the input for the specific post
      fetchComments(postId);
      setNewComments((prev) => ({ ...prev, [postId]: '' }));
    } catch (err) {
      console.error('Error adding comment:', err);
    }
  };

  // Share Post Functionality
  const handleShare = (post) => {
    const postUrl = `https://www.thestylishmama.com/posts/${post.id}`; // Dynamically created post URL in the desired format
    
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: 'Check out this amazing post!',
        url: postUrl, // Share the specific post's URL
      })
      .then(() => console.log('Post shared successfully'))
      .catch((error) => console.error('Error sharing:', error));
    } else {
      navigator.clipboard.writeText(postUrl)
        .then(() => alert('Link copied to clipboard!'))
        .catch(() => alert('Failed to copy link.'));
    }
  };

  return (
    <div className="products-review-page">
      {/* Search Bar */}
      <div className="products-review__search-container">
        <Header
          onSearch={(term) => {
            if (!term.trim()) {
              setFilteredPosts(posts);
            } else {
              setFilteredPosts(
                posts.filter(
                  (post) =>
                    post.title.toLowerCase().includes(term.toLowerCase()) ||
                    post.content.toLowerCase().includes(term.toLowerCase())
                )
              );
            }
          }}
          placeholder="Search product reviews..."
        />
      </div>

      {/* Content */}
      <div className="products-review__content-wrapper">
        {loading ? (
          <div className="loading-container">
            <div className="heart-loader"></div>
          </div>
        ) : error ? (
          <p className="products-review__error-message">{error}</p>
        ) : filteredPosts.length === 0 ? (
          <p className="products-review__no-posts-message">No posts available</p>
        ) : (
          <div className="products-review__grid">
            {filteredPosts.map((post) => (
              <div
                key={post.id}
                id={`post-${post.id}`}
                className="products-review__card"
                style={{ backgroundColor: post.backgroundColor || '#fafafa' }}
              >
                <h2
                  className="products-review__title"
                  style={{
                    color: post.titleStyle?.color || '#000',
                    fontSize: post.titleStyle?.fontSize || '1.5rem',
                    textAlign: post.titleStyle?.textAlign || 'left',
                  }}
                >
                  {post.title}
                </h2>

                <div
                  className="products-review__content"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />

                {post.imageUrl && (
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    className="products-review__image"
                  />
                )}

                {/* Share Button */}
                <button className="share-button" onClick={() => handleShare(post)}>
                      <span className="share-icon">🔗</span> Share
                    </button>

                {/* Comments Section */}
                <div className="comments-section">
                  <h3>Comments</h3>
                  <div className="comments-list">
                    {comments[post.id]?.length > 0 ? (
                      comments[post.id].map((comment) => (
                        <div key={comment.id} className="comment">
                          <p>
                            <strong>{comment.author}</strong>: {comment.content}
                          </p>
                          <p className="comment-date">
                            {new Date(comment.created_at).toLocaleString()}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p>No comments yet. Be the first to comment!</p>
                    )}
                  </div>

                  {/* Add Comment */}
                  <div className="add-comment">
                    <textarea
                      placeholder="Share your thoughts..."
                      value={newComments[post.id] || ''}
                      onChange={(e) =>
                        setNewComments((prev) => ({
                          ...prev,
                          [post.id]: e.target.value,
                        }))
                      }
                    />
                    <button onClick={() => handleAddComment(post.id)}>Post Comment</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsReview;
