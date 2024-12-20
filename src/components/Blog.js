import React, { useEffect, useState } from 'react';
import Header from '../components/Header'; // Import Header component
import '../Blog.css'; // Import Blog-specific CSS

const API_URL = 'https://barkatkamran.com/db.php'; // Backend API endpoint

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch Blog posts on component mount
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}?page=Blog`);
        if (!response.ok) throw new Error('Failed to fetch posts');

        const data = await response.json();
        console.log('Fetched Posts:', data); // Debug fetched posts
        const blogPosts = data.filter((post) => post.page === 'Blog');

        setPosts(blogPosts);
        setFilteredPosts(blogPosts);

        if (blogPosts.length === 0) setError('No posts found for the Blog page.');
      } catch (err) {
        console.error('Error fetching blog posts:', err);
        setError('Failed to load posts. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

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
                className="blog-page__card"
                style={{ backgroundColor: post.backgroundColor || '#fafafa' }}
              >
                <h3 className="blog-page__title">{post.title}</h3>
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
