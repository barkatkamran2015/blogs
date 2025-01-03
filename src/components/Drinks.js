import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom'; // To handle query parameters
import Header from './Header'; // Import Header component
import '../Recipe.css'; // Import the scoped CSS for the Drinks page

const API_URL = 'https://barkatkamran.com/db.php'; // Backend API endpoint

const Drinks = () => {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const location = useLocation(); // To access query parameters from the URL

  // Extract `id` from URL query parameters for scrolling
  const queryParams = new URLSearchParams(location.search);
  const postIdFromQuery = queryParams.get('id');

  // Fetch Drinks posts on mount
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}?page=Drinks`);

        if (!response.ok) throw new Error(`HTTP Error! Status: ${response.status}`);

        const data = await response.json();
        console.log('Fetched Drinks Posts:', data); // Debug fetched posts

        const drinksPosts = data
          .filter((post) => post.page === 'Drinks')
          .map((post) => ({
            ...post,
            titleStyle: post.titleStyle
              ? JSON.parse(post.titleStyle) // Parse `titleStyle` if it exists
              : { color: '#000', fontSize: '1.5rem', textAlign: 'left' }, // Default style
          }));

        // Set posts and filtered posts
        setPosts(drinksPosts);
        setFilteredPosts(drinksPosts);

        // Extract unique categories and tags
        const uniqueCategories = [...new Set(drinksPosts.map((post) => post.category))];
        const uniqueTags = [...new Set(drinksPosts.flatMap((post) => post.tags || []))];

        setCategories(uniqueCategories);
        setTags(uniqueTags);

        if (drinksPosts.length === 0) setError('No posts found for the Drinks page.');

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
        console.error('Error fetching posts:', err);
        setError('Failed to load posts. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [postIdFromQuery]);

  // Search functionality
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

  // Filter functionality
  const handleFilterApply = (selectedCategories, selectedTags) => {
    const filtered = posts.filter(
      (post) =>
        (!selectedCategories.length || selectedCategories.includes(post.category)) &&
        (!selectedTags.length || (post.tags || []).some((tag) => selectedTags.includes(tag)))
    );
    setFilteredPosts(filtered);
  };

  return (
    <div className="recipe-page">
      {loading ? (
        <div className="loading-container">
          <div className="heart-loader"></div>
        </div>
      ) : (
        <>
          {/* Header with Search and Filters */}
          <div className="recipe-page__search-container">
            <Header
              onSearch={handleSearch}
              onFilterApply={handleFilterApply}
              categories={categories}
              tags={tags}
            />
          </div>

          {/* Content Section */}
          <div className="recipe-page__content-wrapper">
            {error ? (
              <p className="recipe-page__error-message">{error}</p>
            ) : filteredPosts.length === 0 ? (
              <p className="recipe-page__no-posts-message">No posts available</p>
            ) : (
              <div className="recipe-page__grid">
                {filteredPosts.map((post) => (
                  <div
                    key={post.id}
                    id={`post-${post.id}`} // Add unique ID for scrolling
                    className="recipe-page__card"
                    style={{ backgroundColor: post.backgroundColor || '#fafafa' }}
                  >
                    {/* Title */}
                    <h2
                      className="recipe-page__title"
                      style={{
                        color: post.titleStyle?.color || '#000',
                        fontSize: post.titleStyle?.fontSize || '1.5rem',
                        textAlign: post.titleStyle?.textAlign || 'left',
                      }}
                    >
                      {post.title}
                    </h2>

                    {/* Content */}
                    <div
                      className="recipe-page__content"
                      dangerouslySetInnerHTML={{ __html: post.content }}
                    />

                    {/* Image */}
                    {post.imageUrl && (
                      <img
                        src={post.imageUrl}
                        alt={post.title}
                        className="recipe-page__image"
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Drinks;
