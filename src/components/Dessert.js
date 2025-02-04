import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom'; // To handle query parameters
import Header from './Header'; // Import Header component
import '../Dessert.css'; // Import the scoped CSS for the Dessert page

const API_URL = 'https://barkatkamran.com/db.php'; // Backend API endpoint

const Dessert = () => {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const location = useLocation(); // To access query parameters from the URL
  const queryParams = new URLSearchParams(location.search);
  const postIdFromQuery = queryParams.get('id');

  // Keep track of viewed posts in session storage
  const viewedPosts = new Set(JSON.parse(sessionStorage.getItem('viewedDessertPosts') || '[]'));

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}?page=Dessert`);
        if (!response.ok) throw new Error(`HTTP Error! Status: ${response.status}`);

        const data = await response.json();
        console.log('Fetched Dessert Posts:', data);

        const dessertPosts = data
          .filter((post) => post.page === 'Dessert')
          .map((post) => ({
            ...post,
            titleStyle: post.titleStyle
              ? JSON.parse(post.titleStyle)
              : { color: '#000', fontSize: '1.5rem', textAlign: 'left' }, // Default style
          }));

        setPosts(dessertPosts);
        setFilteredPosts(dessertPosts);

        const uniqueCategories = [...new Set(dessertPosts.map((post) => post.category))];
        const uniqueTags = [...new Set(dessertPosts.flatMap((post) => post.tags || []))];

        setCategories(uniqueCategories);
        setTags(uniqueTags);

        if (dessertPosts.length === 0) setError('No posts found for the Dessert page.');

        if (postIdFromQuery) {
          setTimeout(() => {
            const element = document.getElementById(`dessert-post-${postIdFromQuery}`);
            if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' });
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

  // Function to increment view count
  const incrementViewCount = async (postId) => {
    if (viewedPosts.has(postId)) return; // Prevent multiple increments per session

    try {
      await fetch(`${API_URL}?method=INCREMENT_VIEW_COUNT&postId=${postId}`, { method: 'POST' });
      console.log(`View count incremented for post ${postId}`);

      viewedPosts.add(postId);
      sessionStorage.setItem('viewedDessertPosts', JSON.stringify([...viewedPosts]));
    } catch (err) {
      console.error('Error incrementing view count:', err);
    }
  };

  // Search functionality
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

  // Filter functionality
  const handleFilterApply = (selectedCategories, selectedTags) => {
    const filtered = posts.filter(
      (post) =>
        (!selectedCategories.length || selectedCategories.includes(post.category)) &&
        (!selectedTags.length || (post.tags || []).some((tag) => selectedTags.includes(tag)))
    );
    setFilteredPosts(filtered);
  };

  // Handle share functionality
  const handleShare = (post) => {
    const postUrl = `https://www.thestylishmama.com/posts/${post.id}`;

    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: 'Check out this amazing post!',
        url: postUrl,
      })
      .then(() => console.log('Post shared successfully'))
      .catch((error) => console.error('Error sharing:', error));
    } else {
      navigator.clipboard.writeText(postUrl)
        .then(() => alert('Link copied to clipboard!'))
        .catch(() => alert('Failed to copy link.'));
    }
  };

  return (
    <div className="dessert-page">
      {loading ? (
        <div className="dessert-loading-container">
          <div className="dessert-heart-loader"></div>
        </div>
      ) : (
        <>
          {/* Header with Search and Filters */}
          <div className="dessert-page__search-container">
            <Header
              onSearch={handleSearch}
              onFilterApply={handleFilterApply}
              categories={categories}
              tags={tags}
            />
          </div>

          {/* Content Section */}
          <div className="dessert-page__content-wrapper">
            {error ? (
              <p className="dessert-page__error-message">{error}</p>
            ) : filteredPosts.length === 0 ? (
              <p className="dessert-page__no-posts-message">No posts available</p>
            ) : (
              <div className="dessert-page__grid">
                {filteredPosts.map((post) => (
                  <div
                    key={post.id}
                    id={`dessert-post-${post.id}`}
                    className="dessert-page__card"
                    style={{ backgroundColor: post.backgroundColor || '#fafafa' }}
                    onMouseEnter={() => incrementViewCount(post.id)} // View tracking
                  >
                    {/* Title */}
                    <h2
                      className="dessert-page__title"
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
                      className="dessert-page__content"
                      dangerouslySetInnerHTML={{ __html: post.content }}
                    />

                    {/* Image */}
                    {post.imageUrl && (
                      <img
                        src={post.imageUrl}
                        alt={post.title}
                        className="dessert-page__image"
                      />
                    )}

                    {/* Share Button */}
                    <button className="share-button" onClick={() => handleShare(post)}>
                      🔗 Share
                    </button>
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

export default Dessert;
