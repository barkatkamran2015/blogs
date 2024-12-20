import React, { useEffect, useState } from 'react';
import Header from '../components/Header'; // Import Header component
import '../Recipe.css'; // Import the scoped CSS for the Recipe page

const API_URL = 'https://barkatkamran.com/db.php'; // Backend API endpoint

const Recipe = () => {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch Recipe posts on mount
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}?page=Recipe`);

        if (!response.ok) throw new Error(`HTTP Error! Status: ${response.status}`);

        const data = await response.json();
        console.log('Fetched Recipe Posts:', data); // Debug fetched posts

        const recipePosts = data.filter((post) => post.page === 'Recipe');

        // Set posts and filtered posts
        setPosts(recipePosts);
        setFilteredPosts(recipePosts);

        // Extract unique categories and tags
        const uniqueCategories = [...new Set(recipePosts.map((post) => post.category))];
        const uniqueTags = [...new Set(recipePosts.flatMap((post) => post.tags || []))];

        setCategories(uniqueCategories);
        setTags(uniqueTags);

        if (recipePosts.length === 0) setError('No posts found for the Recipe page.');
      } catch (err) {
        console.error('Error fetching posts:', err);
        setError('Failed to load posts. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

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
        {loading ? (
          <p className="recipe-page__loading-message">Loading posts...</p>
        ) : error ? (
          <p className="recipe-page__error-message">{error}</p>
        ) : filteredPosts.length === 0 ? (
          <p className="recipe-page__no-posts-message">No posts available</p>
        ) : (
          <div className="recipe-page__grid">
            {filteredPosts.map((post) => (
              <div
                key={post.id}
                className="recipe-page__card"
                style={{ backgroundColor: post.backgroundColor || '#fafafa' }}
              >
                {/* Title */}
                <h2 className="recipe-page__title">{post.title}</h2>

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
    </div>
  );
};

export default Recipe;
