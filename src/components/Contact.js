import React from 'react';
import '../App.css'; // Import the updated CSS

// Import images from the 'public' or 'src/assets' directory
import emailIcon from '../assets/email.png';


export default function ContactPage() {
  return (
    <div id="contact">
      <h2 className="contact-title">CONTACT <span className="highlight">INFO</span></h2>
      
      <div className="contact-container">
        <div className="contact-card">
          <img src={emailIcon} alt="email icon" className="contact-icon" />
          <h3>E-MAIL</h3>
          <p>Fatimarezaie1234@gmail.com</p>
        </div>
      </div>
    </div>
  );
}
