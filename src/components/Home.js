import React, { useState, useEffect } from 'react';
import '../Home.css';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

// Static Images for Slider
import imageBlog from '../assets/kitchen.jpeg';
import imageNature from '../assets/parenting.jpeg';
import imageRecipe from '../assets/bedroom.jpeg';
import imageGarden from '../assets/garden.JPG';
import imageFall from '../assets/fall.jpg';
import imageTulip from '../assets/tulip.JPEG';

const API_URL = 'https://barkatkamran.com/db.php';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Page paths for redirection
  const pagePaths = {
    Recipe: '/food',
    Drinks: '/drinks',
    Dessert: '/dessert',
    Blog: '/blog',
    'Products Review': '/products-review',
  };

  // Fetch all posts on component mount
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await fetch(API_URL); // Simplified to a basic GET request
        if (!response.ok) throw new Error('Failed to fetch posts');

        const data = await response.json();

        // Format posts to parse `titleStyle`
        const formattedPosts = data.map((post) => ({
          ...post,
          titleStyle: post.titleStyle
            ? JSON.parse(post.titleStyle)
            : { color: '#000', fontSize: '1.8rem', textAlign: 'left' },
        }));

        console.log('Fetched and Formatted Posts:', formattedPosts);
        setPosts(formattedPosts);
      } catch (err) {
        console.error('Error fetching posts:', err);
        setError('Failed to load posts. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  // Navigate to specific page (with postId)
  const navigateToPost = (page, postId) => {
    const basePath = pagePaths[page] || '/';
    const targetPath = `${basePath}?id=${postId}`;
    window.location.href = targetPath;
  };

  return (
    <div className="home-page">
      {/* Loading and Error States */}
      {loading ? (
        <div className="loading-container">
          <div className="heart-loader"></div>
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
            <div>
              <img src={imageGarden} alt="Garden" className="home-page__slider-image" />
              <h3 className="home-page__slider-text">Butcher Garden Visit</h3>
            </div>
            <div>
              <img src={imageTulip} alt="Tulip" className="home-page__slider-image" />
              <h3 className="home-page__slider-text">Tulip Festival BC</h3>
            </div>
            <div>
              <img src={imageFall} alt="Fall" className="home-page__slider-image" />
              <h3 className="home-page__slider-text">Beautiful Fall Season</h3>
            </div>
          </Slider>

          {/* Posts Section */}
          <div className="home-page__posts-container">
            {posts.length === 0 ? (
              <p>No posts available</p>
            ) : (
              posts.map((post) => (
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
                    <h2
                      className="home-page__post-title"
                      style={{
                        color: post.titleStyle?.color || '#333',
                        fontSize: post.titleStyle?.fontSize || '1.8rem',
                        textAlign: post.titleStyle?.textAlign || 'left',
                      }}
                    >
                      {post.title}
                    </h2>

                    {/* Display Post Date */}
                    {post.date ? (
                      <p className="home-page__post-date">
                        Posted on: {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </p>
                    ) : (
                      <p className="home-page__post-date">Date not available</p>
                    )}

                    <div
                      className="home-page__post-excerpt"
                      dangerouslySetInnerHTML={{
                        __html: post.content ? post.content.slice(0, 350) + '...' : 'No content available',
                      }}
                    />
                    {/* Read More Button */}
                    <button
                      className="home-page__cta-button"
                      onClick={() => navigateToPost(post.page, post.id)}
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
