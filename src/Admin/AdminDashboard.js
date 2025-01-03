import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import ReactQuill, { Quill } from 'react-quill'; // Import Quill from ReactQuill
import 'react-quill/dist/quill.snow.css';
import ImageResize from 'quill-image-resize';
import DOMPurify from 'dompurify';
import '../AdminDashboard.css';

// Custom Functions and Quill Setup
if (!Quill.imports['modules/imageResize']) {
  Quill.register('modules/imageResize', ImageResize);
}

// Font Sizes
const Size = Quill.import('formats/size');
Size.whitelist = ['Font-Size', '8px', '10px', '12px', '14px', '16px', '18px', '24px', '36px', '48px', '72px'];
Quill.register(Size, true);

 // Set up Font Whitelist
 const Font = Quill.import('formats/font');
 Font.whitelist = [
   'sans-serif',
   'serif',
   'monospace',
   'roboto',
   'arial',
   'times-new-roman',
   'courier-new',
   'comic-sans',
   'georgia',
   'helvetica',
   'verdana',
   'calibri',
   'garamond',
   'tahoma',
   'impact',
   'trebuchet-ms',
   'lucida-console',
   'palatino',
 ];
 Quill.register(Font, true);
 
 // Helper Component: PostContent
 const PostContent = ({ content }) => {
  // Sanitize the content
  const sanitizedContent = DOMPurify.sanitize(content, {
      ALLOWED_TAGS: ['img', 'p', 'div', 'span', 'br', 'strong', 'em', 'a', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li'],
      ALLOWED_ATTR: ['src', 'width', 'height', 'alt', 'style', 'class', 'align'],
  });

  // Parse the sanitized content
  const parser = new DOMParser();
  const doc = parser.parseFromString(sanitizedContent, 'text/html');

  // Ensure images retain dimensions
  doc.querySelectorAll('img').forEach((img) => {
      const width = img.getAttribute('width');
      const height = img.getAttribute('height');
      if (width || height) {
          img.style.width = width ? `${width}px` : 'auto';
          img.style.height = height ? `${height}px` : 'auto';
      }
  });

  return (
      <div
          className="post-content"
          dangerouslySetInnerHTML={{ __html: doc.body.innerHTML }}
      />
  );
};


const API_URL = 'https://barkatkamran.com/db.php';

const AdminDashboard = () => {
  const [titleColor, setTitleColor] = useState('#000000'); // Default black color
  const [titleSize, setTitleSize] = useState('24px'); // Default size
  const [titlePosition, setTitlePosition] = useState('center'); // Default center alignment

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedPage, setSelectedPage] = useState('Blog');
  const [imageURL, setImageURL] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [posts, setPosts] = useState([]);
  const [allPosts, setAllPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentPostId, setCurrentPostId] = useState(null);
  const [selectedBackgroundColor, setSelectedBackgroundColor] = useState('#ffffff');
  const quillRef = useRef(null);
  const editorContainerRef = useRef(null); // Ref for the editor container

  // Fetch all posts from the backend
  const fetchPosts = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}?method=GET`);
      if (!response.ok) throw new Error('Failed to fetch posts');

      const postData = await response.json();
      console.log('Fetched Posts:', postData); // Debugging

      const formattedPosts = postData.map((post) => ({
        ...post,
        titleStyle: post.titleStyle
          ? JSON.parse(post.titleStyle) // Parse JSON if titleStyle is a string
          : { color: '#000', fontSize: '24px', textAlign: 'center' }, // Default
      }));
      console.log('Formatted Posts with Title Style:', formattedPosts); // Debugging

      setAllPosts(formattedPosts);
      setPosts(formattedPosts.filter((post) => post.page === selectedPage));
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError('Failed to fetch posts. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [selectedPage]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // Handle image upload
  const handleImageUpload = async (e, insertIntoEditor = false) => {
    const file = e.target.files[0];
    if (!file) {
      setError('No file selected');
      return;
    }
  
    const formData = new FormData();
    formData.append('file', file);
  
    try {
      setIsLoading(true);
      const response = await fetch(`${API_URL}?method=UPLOAD`, {
        method: 'POST',
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error('Failed to upload image');
      }
  
      const responseData = await response.json();
      console.log('Image Upload Response:', responseData);
  
      // Construct the correct URL using your backend base URL
      const uploadedImageURL = responseData.imageUrl.startsWith('http')
        ? responseData.imageUrl
        : `${API_URL.replace('/db.php', '')}${responseData.imageUrl}`;
  
      console.log('Uploaded Image URL:', uploadedImageURL);
  
      if (insertIntoEditor) {
        const editor = quillRef.current?.getEditor();
        if (editor) {
          editor.focus();
          const range = editor.getSelection() || { index: editor.getLength(), length: 0 };
          editor.insertEmbed(range.index, 'image', uploadedImageURL);
          editor.setSelection(range.index + 1);
        }
      }
  
      setImageURL(uploadedImageURL); // Save the uploaded image URL
      setError('');
    } catch (err) {
      console.error('Error uploading image:', err);
      setError('Failed to upload image. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  

 // Persist image dimensions and positioning styles for resizing
 const persistImageDimensions = (content) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(content, 'text/html');

  doc.querySelectorAll('img').forEach((img) => {
    const width = img.style.width || img.getAttribute('width');
    const height = img.style.height || img.getAttribute('height');

    // Apply width/height to style inline
    if (width) img.style.width = width.endsWith('px') ? width : `${width}px`;
    if (height) img.style.height = height.endsWith('px') ? height : `${height}px`;

    // Set attributes explicitly for redundancy
    if (width) img.setAttribute('width', width.replace('px', ''));
    if (height) img.setAttribute('height', height.replace('px', ''));
  });

  return doc.body.innerHTML;
};
 
  
const handlePostSubmission = async (e) => {
  e.preventDefault();

  // 1. Validation: Ensure title and content are provided
  const validateTitleStyle = (style) => {
    const validColors = /^#[0-9A-F]{6}$/i; // Hex color validation
    const validFontSizes = ['8px', '10px', '12px', '14px', '16px', '18px', '24px', '36px', '48px', '72px'];
    const validTextAligns = ['left', 'center', 'right'];

    return {
      color: validColors.test(style.color) ? style.color : '#000000',
      fontSize: validFontSizes.includes(style.fontSize) ? style.fontSize : '24px',
      textAlign: validTextAligns.includes(style.textAlign) ? style.textAlign : 'center',
    };
  };

  // Validate and ensure proper title style
  const validatedStyle = validateTitleStyle({
    color: titleColor,
    fontSize: titleSize,
    textAlign: titlePosition,
  });

  // Ensure the title and content are provided
  if (!title.trim()) {
    setError('Title is required.');
    return;
  }

  if (!content.trim()) {
    setError('Content is required.');
    return;
  }

  try {
    setIsLoading(true);
    setError(''); // Reset any previous errors
    setSuccessMessage(''); // Reset any previous success messages

    // 2. Process and sanitize content
    const processedContent = persistImageDimensions(content); // Ensure images retain dimensions
    const sanitizedContent = DOMPurify.sanitize(processedContent, {
      ALLOWED_TAGS: ['img', 'p', 'div', 'span', 'br', 'strong', 'em', 'a', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li'],
      ALLOWED_ATTR: ['src', 'width', 'height', 'alt', 'style', 'class', 'align'],
    });

    // 3. Prepare payload for the server
    const requestBody = {
      id: editMode ? currentPostId : null, // Include ID if in edit mode
      title: title.trim(),
      content: sanitizedContent,
      imageUrl: imageURL || '', // Use existing image URL or empty string
      page: selectedPage, // Current page (e.g., Blog, Products Review)
      backgroundColor: selectedBackgroundColor || '#ffffff', // Include selected background color
      titleStyle: validatedStyle, // Ensure the validated title style is used
      creator_uid: 'admin123', // Add a placeholder or dynamic user ID for `creator_uid`
    };

    console.log('Request Payload:', requestBody); // Debugging request payload

    // 4. Determine endpoint and method
    const endpoint = editMode
      ? `${API_URL}?method=UPDATE_POST&id=${currentPostId}` // Query param for updates
      : `${API_URL}?method=CREATE_POST`; // Query param for creation

    const method = editMode ? 'PUT' : 'POST'; // Use PUT for updates and POST for creation

    // 5. Send request to the server
    const response = await fetch(endpoint, {
      method, // Dynamically set the HTTP method
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    });

    console.log('Server Response Status:', response.status); // Debug response status

    // 6. Handle server response
    if (!response.ok) {
      const errorText = await response.text(); // Capture additional error information
      throw new Error(`Failed to save post. Server responded with: ${errorText}`);
    }

    const responseData = await response.json(); // Parse JSON response
    console.log('Server Response Data:', responseData); // Debug response data

    // 7. Success: Notify user and refresh posts
    setSuccessMessage(responseData.message || (editMode ? 'Post updated successfully!' : 'Post created successfully!'));
    fetchPosts(); // Refresh the posts list
    resetForm(); // Reset the form inputs
  } catch (err) {
    console.error('Error saving post:', err); // Log error for debugging
    setError(`Failed to ${editMode ? 'update' : 'save'} post. Reason: ${err.message}`);
  } finally {
    setIsLoading(false); // Reset loading state
  }
};

  
  // Handle delete post
  const handleDelete = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;

    try {
      setIsLoading(true);
      const response = await fetch(`${API_URL}?id=${postId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete post');
      }

      const responseData = await response.json();
      setSuccessMessage(responseData.message || 'Post deleted successfully!');
      fetchPosts();
    } catch (err) {
      console.error('Error deleting post:', err);
      setError('Failed to delete post. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

    // Handle editing a post
    const handleEdit = (post) => {
      // Set editor states based on the post being edited
      setTitle(post.title);
      setContent(persistImageDimensions(post.content));
      setSelectedPage(post.page || 'Blog');
      setImageURL(post.imageUrl || '');
      setSelectedBackgroundColor(post.backgroundColor || '#ffffff');
      setEditMode(true);
      setCurrentPostId(post.id);
    
      // Populate title style fields
      setTitleColor(post.titleStyle?.color || '#000000');
      setTitleSize(post.titleStyle?.fontSize || '24px');
      setTitlePosition(post.titleStyle?.textAlign || 'center');
    
      // Scroll to the editor
      editorContainerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };    

  // Reset form to initial state
  const resetForm = () => {
    setTitle('');
    setContent('');
    setSelectedPage('Blog');
    setImageURL('');
    setEditMode(false);
    setCurrentPostId(null);
    setError('');
    setSuccessMessage('');
  };

  useEffect(() => {
    fetchPosts();
  }, [selectedPage]);

  const handleSearch = (query) => {
    const lowerCaseQuery = query.toLowerCase();
    const filteredPosts = allPosts.filter(
      (post) =>
        post.title.toLowerCase().includes(lowerCaseQuery) ||
        (post.content && post.content.toLowerCase().includes(lowerCaseQuery))
    );
    setPosts(filteredPosts);
  };


// Function to Apply Theme and Save the Selected Color
const applyTheme = (themeColor) => {
  const editor = document.querySelector('.ql-editor');
  if (editor) {
    editor.style.backgroundColor = themeColor; // Apply background color in the editor
  }
  setSelectedBackgroundColor(themeColor); // Save selected color to state
}
const modules = useMemo(() => ({
  toolbar: {
    container: [
      [{ font: Font.whitelist }], 
      [{ size: Size.whitelist }],
      [{ header: [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ color: [] }, { background: [] }],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ align: [] }],
      ['link', 'image', 'video', 'code-block'],
      ['clean'],
    ],
  },
  imageResize: true,
  clipboard: {
    matchVisual: false, // Prevent Quill from overwriting styles when pasting content
  },
}), []);

return (
  <div className="admin-dashboard">
    <h2>Admin Dashboard</h2>

    {/* Loading, Success, and Error Messages */}
    {isLoading && <div className="loading-spinner">Loading...</div>}
    {successMessage && <p className="success-message">{successMessage}</p>}
    {error && <p className="error-message">{error}</p>}

    {/* Search Bar */}
    <div className="search-container">
      <input
        type="text"
        placeholder="Search posts"
        value={searchQuery}
        onChange={(e) => {
          setSearchQuery(e.target.value);
          handleSearch(e.target.value);
        }}
        className="search-input"
      />
    </div>

    {/* Post Form */}
    <form
      onSubmit={handlePostSubmission}
      className="post-form"
      ref={editorContainerRef} // Ref for scrolling to editor
    >
      {/* Post Title */}
      <input
        type="text"
        placeholder="Post Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="title-input"
      />

      {/* Image Upload */}
      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="image-upload"
      />
      {imageURL && (
        <img src={imageURL} alt="Uploaded" className="uploaded-image" />
      )}

      {/* Rich Text Editor */}
      <div
  className="editor-container"
  style={{ backgroundColor: selectedBackgroundColor }} // Apply selected background color
>
  <label htmlFor="rich-editor" className="form-label">
    Write Content:
  </label>
  <ReactQuill
    ref={quillRef}
    value={content}
    onChange={setContent}
    theme="snow"
    modules={modules}
    className="quill-editor"
  />
</div>

      {/* Title Styling */}
      <div className="form-group title-style-group">
        <label htmlFor="title-color" className="form-label">Title Color:</label>
        <input
          type="color"
          id="title-color"
          value={titleColor}
          onChange={(e) => setTitleColor(e.target.value)}
          className="color-picker"
        />

        <label htmlFor="title-size" className="form-label">Title Font Size:</label>
        <select
          id="title-size"
          value={titleSize}
          onChange={(e) => setTitleSize(e.target.value)}
          className="size-select"
        >
          <option value="16px">Small</option>
          <option value="24px">Medium</option>
          <option value="36px">Large</option>
          <option value="48px">Extra Large</option>
        </select>

        <label htmlFor="title-position" className="form-label">Title Alignment:</label>
        <select
          id="title-position"
          value={titlePosition}
          onChange={(e) => setTitlePosition(e.target.value)}
          className="position-select"
        >
          <option value="left">Left</option>
          <option value="center">Center</option>
          <option value="right">Right</option>
        </select>
      </div>

      {/* Page Selection */}
      <div className="form-group page-select-group">
        <label htmlFor="page-select" className="form-label">
          Select Page:
        </label>
        <select
          id="page-select"
          value={selectedPage}
          onChange={(e) => setSelectedPage(e.target.value)}
          className="page-select"
        >
          <option value="Blog">Blog</option>
          <option value="Products Review">Products Review</option>
          <option value="Recipe">Food</option>
          <option value="Drinks">Drinks</option>
          <option value="Dessert">Dessert</option>
        </select>
      </div>

      {/* Theme Background Color Selection */}
      <div className="form-group theme-select-group">
        <label htmlFor="theme-select" className="form-label">
          Select Background Theme:
        </label>
        <select
          id="theme-select"
          onChange={(e) => applyTheme(e.target.value)}
          className="page-select"
        >
          <option value="#ffffff">Default</option>
          <option value="#e0f7fa">Blue</option>
          <option value="#e8f5e9">Green</option>
          <option value="#eceff1">Gray</option>
          <option value="#006a7a">Blue-Green Cyan</option>
          <option value="#6568a6">Slate Blue</option>
          <option value="#c299c0">Pastel Lavender</option>
        </select>
      </div>

      {/* Submit Button */}
      <button type="submit" className="submit-button">
        {editMode ? 'Update Post' : 'Create Post'}
      </button>
    </form>

    {/* Display Posts */}
    <div className="posts-list">
      <h3>Recent Posts for {selectedPage}</h3>
      {posts.length === 0 ? (
        <p>No posts available for {selectedPage}</p>
      ) : (
        posts.map((post) => (
          <div
            key={post.id}
            className="post-item"
            style={{
              backgroundColor: post.backgroundColor || '#ffffff',
              transition: 'background-color 0.3s ease',
            }}
          >
            {/* Post Title */}
            <h4
              className="post-title"
              style={{
                color: post.titleStyle?.color || '#000', // Default to black
                fontSize: post.titleStyle?.fontSize || '24px', // Default size
                textAlign: post.titleStyle?.textAlign || 'center', // Default alignment
              }}
            >
              {post.title}
            </h4>

            {/* Post Content */}
            <PostContent content={post.content} />

            {/* Post Image */}
            {post.imageUrl && (
              <img
                src={post.imageUrl}
                alt={post.title}
                className="post-image"
              />
            )}

            {/* Post Meta */}
            <p className="post-meta">
              <strong>Page:</strong> {post.page}
            </p>

            {/* Action Buttons */}
            <div className="post-actions">
              <button
                onClick={() => handleEdit(post)}
                className="edit-button"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(post.id)}
                className="delete-button"
              >
                Delete
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  </div>
);
}
export default AdminDashboard;
