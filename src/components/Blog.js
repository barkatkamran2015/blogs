import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom'; // To handle URL parameters
import Header from '../components/Header'; // Import Header component
import '../Blog.css'; // Import Blog-specific CSS

const API_URL = 'https://barkatkamran.com/db.php'; // Backend API endpoint

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const location = useLocation(); // To access the query params

  // Extract `id` from URL query params to scroll to the specific post
  const queryParams = new URLSearchParams(location.search);
  const postIdFromQuery = queryParams.get('id');

  // Fetch Blog posts on component mount
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}?page=Blog`);
        if (!response.ok) throw new Error('Failed to fetch posts');

        const data = await response.json();
        console.log('Fetched Posts:', data); // Debug fetched posts

        const blogPosts = data
          .filter((post) => post.page === 'Blog')
          .map((post) => ({
            ...post,
            titleStyle: post.titleStyle
              ? JSON.parse(post.titleStyle) // Parse `titleStyle` if it exists
              : { color: '#000', fontSize: '1.5rem', textAlign: 'left' }, // Default style
          }));

        setPosts(blogPosts);
        setFilteredPosts(blogPosts);

        if (blogPosts.length === 0) setError('No posts found for the Blog page.');

        // Scroll to the specific post if `id` is provided in the query
        if (postIdFromQuery) {
          setTimeout(() => {
            const element = document.getElementById(`post-${postIdFromQuery}`);
            if (element) {
              element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }, 500); // Delay to ensure DOM is rendered
        }
      } catch (err) {
        console.error('Error fetching blog posts:', err);
        setError('Failed to load posts. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [postIdFromQuery]);

  // Search functionality to filter posts
  const handleSearch = (searchTerm) => {
    if (!searchTerm.trim()) {
      setFilteredPosts(posts); // Reset to all posts if search term is empty
    } else {
      const filtered = posts.filter(
        (post) =>
          post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredPosts(filtered);
    }
  };

  return (
    <div className="blog-page">
      {/* Header with Search */}
      <div className="blog-page__search-container">
        <Header onSearch={handleSearch} />
      </div>

      {/* Content Grid */}
      <div className="blog-page__content-wrapper">
        {loading ? (
          <p className="blog-page__loading-message">Loading posts...</p>
        ) : error ? (
          <p className="blog-page__error-message">{error}</p>
        ) : filteredPosts.length === 0 ? (
          <p className="blog-page__no-posts-message">No posts available</p>
        ) : (
          <div className="blog-page__grid">
            {filteredPosts.map((post) => (
              <div
                key={post.id}
                id={`post-${post.id}`} // Add unique ID for scrolling
                className="blog-page__card"
                style={{ backgroundColor: post.backgroundColor || '#fafafa' }}
              >
                <h3
                  className="blog-page__title"
                  style={{
                    color: post.titleStyle?.color || '#000', // Title color
                    fontSize: post.titleStyle?.fontSize || '1.5rem', // Font size
                    textAlign: post.titleStyle?.textAlign || 'left', // Text alignment
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
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Blog;
