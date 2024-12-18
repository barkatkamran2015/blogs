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
  const sanitizedContent = DOMPurify.sanitize(content, {
    ALLOWED_TAGS: ['img', 'p', 'div', 'span', 'br', 'strong', 'em', 'a', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li'],
    ALLOWED_ATTR: ['src', 'width', 'height', 'alt', 'style', 'class', 'align'],
  });  

  const parser = new DOMParser();
  const doc = parser.parseFromString(sanitizedContent, 'text/html');

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

  // Fetch all posts from the backend
  const fetchPosts = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_URL}?method=GET`);
      if (!response.ok) {
        throw new Error(`Failed to fetch posts: ${response.statusText}`);
      }
      const postData = await response.json();
      setAllPosts(postData);
      setPosts(postData.filter((post) => post.page === selectedPage));
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError('Failed to fetch posts. Please try again later.');
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
  if (!content) {
    setError('Content is required');
    return;
}

  try {
    setIsLoading(true);
    setError(''); // Reset any previous errors
    setSuccessMessage(''); // Reset any previous success messages

    // 2. Process and sanitize content
    const processedContent = persistImageDimensions(content); // Ensure images retain dimensions
    const sanitizedContent = DOMPurify.sanitize(content, {
      ALLOWED_TAGS: ['img', 'p', 'div', 'span', 'br', 'strong', 'em', 'a', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li'],
      ALLOWED_ATTR: ['src', 'width', 'height', 'alt', 'style', 'class', 'align'],
    });    

    // 3. Prepare payload for the server
    const requestBody = {
      id: editMode ? currentPostId : null, // Include 'id' only in edit mode
      title: title.trim(),
      content: sanitizedContent,
      imageUrl: imageURL || '', // Provide fallback empty string for imageURL
      page: selectedPage,
      backgroundColor: selectedBackgroundColor || '#ffffff',
    };

    console.log('Request Payload:', requestBody); // Debugging request payload

    // 4. Send request to the server
    const method = editMode ? 'PUT' : 'POST';
    const response = await fetch(API_URL, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    });

    console.log('Server Response Status:', response.status); // Debug response status

    // 5. Handle server response
    if (!response.ok) {
      throw new Error(`Failed to fetch posts: ${response.statusText}`);
    }    

    const responseData = await response.json(); // Parse success response
    console.log('Server Response Data:', responseData);

    // 6. Success: Notify user and refresh posts
    setSuccessMessage(responseData.message || 'Post saved successfully!');
    fetchPosts(); // Refresh posts list
    resetForm(); // Reset the form inputs

  } catch (err) {
    console.error('Error saving post:', err.message);
    setError(`Failed to save post. Reason: ${err.message}`);
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
    setTitle(post.title);
    setContent(persistImageDimensions(post.content)); // Ensure dimensions persist on edit
    setSelectedPage(post.page || 'Blog');
    setImageURL(post.imageUrl || '');
    setEditMode(true);
    setCurrentPostId(post.id);
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
    <form onSubmit={handlePostSubmission} className="post-form">
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
<div className="editor-container">
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
    <option value="Recipe">Recipe</option>
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
    <option value="#6568a6">Slat Blue</option>
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
            <h4 className="post-title">{post.title}</h4>

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
