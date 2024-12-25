import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../components/Header';
import '../Blog.css';

const API_URL = 'https://barkatkamran.com/db.php';

const Blog = () => {
  const [posts, setPosts] = useState([]); // Store all posts
  const [filteredPosts, setFilteredPosts] = useState([]); // Filtered posts for search
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(''); // Error state
  const [comments, setComments] = useState({}); // Comments mapped by post ID
  const [newComments, setNewComments] = useState({}); // New comments per post
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const postIdFromQuery = queryParams.get('id');

  // Fetch all posts
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}?page=Blog`);
        if (!response.ok) throw new Error('Failed to fetch posts');
        const data = await response.json();

        const formattedPosts = data.map((post) => ({
          ...post,
          titleStyle: post.titleStyle
            ? JSON.parse(post.titleStyle)
            : { color: '#000', fontSize: '1.5rem', textAlign: 'left' },
        }));

        setPosts(formattedPosts);
        setFilteredPosts(formattedPosts);

        if (postIdFromQuery) {
          setTimeout(() => {
            const element = document.getElementById(`post-${postIdFromQuery}`);
            if (element) {
              element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }, 500);
        }
      } catch (err) {
        console.error('Error fetching posts:', err);
        setError('Failed to load posts. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [postIdFromQuery]);

  // Handle search functionality
  const handleSearch = (searchTerm) => {
    if (!searchTerm.trim()) {
      setFilteredPosts(posts);
    } else {
      const filtered = posts.filter(
        (post) =>
          post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredPosts(filtered);
    }
  };

  // Fetch comments for a specific post
  const fetchComments = async (postId) => {
    try {
      const response = await fetch(`${API_URL}?comments_for_post=${postId}`);
      if (!response.ok) throw new Error('Failed to fetch comments');
      const data = await response.json();
      setComments((prev) => ({ ...prev, [postId]: data }));
    } catch (err) {
      console.error('Error fetching comments:', err);
    }
  };

  // Add a new comment to a specific post
  const addComment = async (postId) => {
    const newComment = newComments[postId];
    if (!newComment || !newComment.trim()) return;

    try {
      const response = await fetch(`${API_URL}?method=POST_COMMENT`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          post_id: postId,
          creator_name: 'Anonymous', // You can replace this with an actual user system
          comment_text: newComment,
        }),
      });
      if (!response.ok) throw new Error('Failed to add comment');
      const updatedComments = await response.json();

      // Update comments in state
      setComments((prev) => ({ ...prev, [postId]: updatedComments }));
      setNewComments((prev) => ({ ...prev, [postId]: '' })); // Clear input field
    } catch (err) {
      console.error('Error adding comment:', err);
    }
  };

  // Increment view count for a post
  const incrementViewCount = async (postId) => {
    try {
      await fetch(`${API_URL}?method=INCREMENT_VIEW_COUNT&postId=${postId}`, {
        method: 'POST',
      });
    } catch (err) {
      console.error('Error incrementing view count:', err);
    }
  };

  return (
    <div className="blog-page">
      <div className="blog-page__search-container">
        <Header onSearch={handleSearch} />
      </div>

      <div className="blog-page__content-wrapper">
        {loading ? (
          <div className="loading-container">
            <div className="heart-loader"></div>
          </div>
        ) : error ? (
          <p className="blog-page__error-message">{error}</p>
        ) : filteredPosts.length === 0 ? (
          <p className="blog-page__no-posts-message">No posts available</p>
        ) : (
          <div className="blog-page__grid">
            {filteredPosts.map((post) => (
              <div
                key={post.id}
                id={`post-${post.id}`}
                className="blog-page__card"
                style={{ backgroundColor: post.backgroundColor || '#fafafa' }}
                onMouseEnter={() => {
                  incrementViewCount(post.id);
                  fetchComments(post.id); // Fetch comments when hovering
                }}
              >
                <h3
                  className="blog-page__title"
                  style={{
                    color: post.titleStyle?.color || '#000',
                    fontSize: post.titleStyle?.fontSize || '1.5rem',
                    textAlign: post.titleStyle?.textAlign || 'left',
                  }}
                >
                  {post.title}
                </h3>
                <div
                  className="blog-page__content"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />
                {post.imageUrl && (
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    className="blog-page__image"
                  />
                )}

                <p className="blog-page__meta">Views: {post.views || 0}</p>

                {/* Comments Section */}
                <div className="blog-page__comments">
                  <h4>Comments:</h4>
                  {comments[post.id]?.length > 0 ? (
                    <ul>
                      {comments[post.id].map((comment) => (
                        <li key={comment.id}>
                          <strong>{comment.creator_name}:</strong> {comment.comment_text}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>No comments yet. Be the first to comment!</p>
                  )}

                  <textarea
                    value={newComments[post.id] || ''}
                    onChange={(e) =>
                      setNewComments((prev) => ({
                        ...prev,
                        [post.id]: e.target.value,
                      }))
                    }
                    placeholder="Write your comment..."
                  />
                  <button onClick={() => addComment(post.id)}>Add Comment</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Blog;
