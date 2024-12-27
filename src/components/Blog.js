import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../components/Header';
import '../Blog.css';

const API_URL = 'https://barkatkamran.com/db.php';

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
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

        console.log('Posts fetched:', formattedPosts);
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

  // Increment view count for a post
  const incrementViewCount = async (postId) => {
    try {
      await fetch(`${API_URL}?method=INCREMENT_VIEW_COUNT&postId=${postId}`, {
        method: 'POST',
      });
      console.log(`View count incremented for post ${postId}`);
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
          <div className="blog-page__error-message">
            <p>{error}</p>
            <button onClick={() => window.location.reload()}>Retry</button>
          </div>
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
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Blog;
