import React, { useState, useEffect } from 'react';
import '../Home.css';
import SearchBar from '../components/SearchBar';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

// Static Images for Slider
import imageBlog from '../assets/blog.jpg';
import imageNature from '../assets/nature.jpg';
import imageRecipe from '../assets/recipe.jpg';

const API_URL = 'https://barkatkamran.com/db.php';

const Home = () => {
  const [posts, setPosts] = useState([]); // All fetched posts
  const [filteredPosts, setFilteredPosts] = useState([]); // Search results
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(''); // Error state

  // Page paths for redirection
  const pagePaths = {
    Recipe: '/recipe',
    Blog: '/blog',
    'Products Review': '/products-review',
  };

  // Fetch posts on component mount
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}?method=GET`);
        if (!response.ok) throw new Error('Failed to fetch posts');

        const data = await response.json();
        setPosts(data);
        setFilteredPosts(data);
      } catch (err) {
        console.error('Error fetching posts:', err);
        setError('Failed to load posts. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  // Handle search functionality
  const handleSearch = (query) => {
    const lowerCaseQuery = query.toLowerCase();
    const results = posts.filter(
      (post) =>
        post.title.toLowerCase().includes(lowerCaseQuery) ||
        (post.content && post.content.toLowerCase().includes(lowerCaseQuery))
    );
    setFilteredPosts(results);
  };

  // Navigate to specific page (without postId)
  const navigateToPost = (page) => {
    const basePath = pagePaths[page] || '/';
    window.location.href = basePath;
  };

  return (
    <div className="home-page">
      {/* Loading and Error States */}
      {loading ? (
        <div className="home-page__loading-spinner">
          <p>Loading...</p>
        </div>
      ) : error ? (
        <p className="home-page__error-message">{error}</p>
      ) : (
        <>
          {/* Featured Slider */}
          <Slider className="home-page__featured-slider" autoplay dots>
            <div>
              <img src={imageBlog} alt="Blog" className="home-page__slider-image" />
              <h3 className="home-page__slider-text">Explore Inspiring Blogs</h3>
            </div>
            <div>
              <img src={imageNature} alt="Nature" className="home-page__slider-image" />
              <h3 className="home-page__slider-text">Discover Nature's Beauty</h3>
            </div>
            <div>
              <img src={imageRecipe} alt="Recipe" className="home-page__slider-image" />
              <h3 className="home-page__slider-text">Healthy Recipe Ideas</h3>
            </div>
          </Slider>

          {/* Search Bar */}
          <SearchBar
            onSearch={handleSearch}
            placeholder="Search for blogs, reviews, or recipes..."
          />

          {/* Posts Section */}
          <div className="home-page__posts-container">
            {filteredPosts.length === 0 ? (
              <p>No posts available</p>
            ) : (
              filteredPosts.map((post) => (
                <div
                  key={post.id}
                  className="home-page__post-item"
                  style={{ backgroundColor: post.backgroundColor || '#fff' }}
                >
                  {/* Image */}
                  {post.imageUrl && (
                    <img
                      src={post.imageUrl}
                      alt={post.title}
                      className="home-page__post-image"
                    />
                  )}

                  {/* Details */}
                  <div className="home-page__post-details">
                    <h2 className="home-page__post-title">{post.title}</h2>
                    <div
                      className="home-page__post-excerpt"
                      dangerouslySetInnerHTML={{
                        __html: post.content.slice(0, 150) + '...',
                      }}
                    />
                    {/* Read More Button */}
                    <button
                      className="home-page__cta-button"
                      onClick={() => navigateToPost(post.page)} // Redirects to the page path only
                    >
                      Read More
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Home;
