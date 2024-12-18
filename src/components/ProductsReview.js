import React, { useEffect, useState } from 'react';
import Header from '../components/Header'; // Import Header component
import '../ProductsReview.css'; // Custom CSS for Products Review page

const API_URL = 'https://barkatkamran.com/db.php'; // Your backend API endpoint

const ProductsReview = () => {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);

        const response = await fetch(`${API_URL}?page=Products Review`);
        if (!response.ok) throw new Error('Failed to fetch posts');

        const data = await response.json();

        const productsReviewPosts = data.filter((post) => post.page === 'Products Review');
        setPosts(productsReviewPosts);
        setFilteredPosts(productsReviewPosts);

        if (productsReviewPosts.length === 0) {
          setError('No posts found for the Products Review page.');
        }
      } catch (err) {
        setError('Failed to load posts. Please try again.');
        console.error('Error fetching posts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handleSearch = (searchTerm) => {
    const filtered = posts.filter(
      (post) =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.content.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPosts(filtered);
  };

  return (
    <div className="products-review-page">
      {/* Search Bar */}
      <div className="products-review__search-container">
        <Header onSearch={handleSearch} />
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
                className="products-review__card"
                style={{ backgroundColor: post.backgroundColor || '#fafafa' }}
              >
                <h3 className="products-review__title">{post.title}</h3>
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
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsReview;
