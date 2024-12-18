import React from 'react';
import { Link } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './Footer.css'; 

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section about">
          <h2>About Us</h2>
          <p>Welcome to our space! Moms from all around the world, let’s come
together to share our experiences, support one another, and dive into
the beautiful journey of motherhood. Whether you're an immigrant mom
or a mom from any corner of the globe, this blog is a place for all of
us to connect, learn, and grow together.</p>
        </div>
        <div className="footer-section links">
          <h2>Quick Links</h2>
          <ul>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/contact">Contact Us</Link></li>
            <li><Link to="/products-review">Products Review</Link></li>
            <li><Link to="/recipe">Recipe</Link></li>
            <li><Link to="/blog">Blog</Link></li>
          </ul>
        </div>
        <div className="footer-section social">
          <h2>Follow Us</h2>
          <div className="social-icons">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"><i className="fab fa-facebook-f"></i></a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"><i className="fab fa-twitter"></i></a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"><i className="fab fa-instagram"></i></a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"><i className="fab fa-linkedin-in"></i></a>
          </div>
        </div>
        <div className="footer-section contact">
          <h2>Contact Us</h2>
          <p><i className="fas fa-envelope"></i> fatimarezaie1234@gmail.com</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} All Rights Reserved.</p>
      </div>
    </footer>
  );
}
