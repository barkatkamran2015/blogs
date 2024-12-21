import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom'; // To handle query parameters
import Header from '../components/Header'; // Import Header component
import '../ProductsReview.css'; // Custom CSS for Products Review page

const API_URL = 'https://barkatkamran.com/db.php'; // Your backend API endpoint

const ProductsReview = () => {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const location = useLocation(); // To get query parameters
  const queryParams = new URLSearchParams(location.search);
  const postIdFromQuery = queryParams.get('id'); // Extract `id` from query parameters

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);

        const response = await fetch(`${API_URL}?page=Products Review`);
        if (!response.ok) throw new Error(`HTTP Error! Status: ${response.status}`);

        const data = await response.json();
        console.log('Fetched Products Review Posts:', data); // Debug fetched data

        // Format and map posts with title styles
        const productsReviewPosts = data
          .filter((post) => post.page === 'Products Review')
          .map((post) => ({
            ...post,
            titleStyle: post.titleStyle
              ? JSON.parse(post.titleStyle) // Parse `titleStyle` if it exists
              : { color: '#000', fontSize: '1.5rem', textAlign: 'left' }, // Default style
          }));

        setPosts(productsReviewPosts);
        setFilteredPosts(productsReviewPosts);

        if (productsReviewPosts.length === 0) {
          setError('No posts found for the Products Review page.');
        }

        // Scroll to the specific post if `id` is provided in the query
        if (postIdFromQuery) {
          setTimeout(() => {
            const element = document.getElementById(`post-${postIdFromQuery}`);
            if (element) {
              element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }, 500); // Delay ensures DOM is rendered
        }
      } catch (err) {
        setError('Failed to load posts. Please try again.');
        console.error('Error fetching posts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [postIdFromQuery]);

  const handleSearch = (searchTerm) => {
    if (!searchTerm.trim()) {
      setFilteredPosts(posts); // Reset to all posts
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
    <div className="products-review-page">
      {/* Search Bar */}
      <div className="products-review__search-container">
        <Header onSearch={handleSearch} placeholder="Search product reviews..." />
      </div>

      {/* Content */}
      <div className="products-review__content-wrapper">
        {loading ? (
          <p className="products-review__loading-message">Loading posts...</p>
        ) : error ? (
          <p className="products-review__error-message">{error}</p>
        ) : filteredPosts.length === 0 ? (
          <p className="products-review__no-posts-message">No posts available</p>
        ) : (
          <div className="products-review__grid">
            {filteredPosts.map((post) => (
              <div
                key={post.id}
                id={`post-${post.id}`} // Add unique ID for scrolling
                className="products-review__card"
                style={{ backgroundColor: post.backgroundColor || '#fafafa' }}
              >
                {/* Title */}
                <h2
                  className="products-review__title"
                  style={{
                    color: post.titleStyle?.color || '#000', // Apply color
                    fontSize: post.titleStyle?.fontSize || '1.5rem', // Apply font size
                    textAlign: post.titleStyle?.textAlign || 'left', // Apply alignment
                  }}
                >
                  {post.title}
                </h2>

                {/* Content */}
                <div
                  className="products-review__content"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />

                {/* Image */}
                {post.imageUrl && (
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    className="products-review__image"
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

export default ProductsReview;
