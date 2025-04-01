import { useState } from 'react';
import styles from '../styles/Contact.module.css';

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });
    const [status, setStatus] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        try {
            const response = await fetch('/api/sendmail', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const result = await response.json();
            setStatus(result.success ? 'Message sent successfully!' : 'Error sending message.');
            
            if (result.success) {
                setFormData({ name: '', email: '', message: '' });
            }
        } catch (error) {
            setStatus('Error: Unable to send message.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={styles.contactPage}>
            <div className={styles.contactFormContainer}>
                <h2 className={styles.title}>Get in Touch</h2>
                <form onSubmit={handleSubmit} className={styles.contactForm}>
                    <div className={styles.formGroup}>
                        <label htmlFor="name" className={styles.label}>Name</label>
                        <input
                            type="text"
                            id="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Your Name"
                            required
                            className={styles.input}
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="email" className={styles.label}>Email</label>
                        <input
                            type="email"
                            id="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="your@email.com"
                            required
                            className={styles.input}
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="message" className={styles.label}>Message</label>
                        <textarea
                            id="message"
                            value={formData.message}
                            onChange={handleChange}
                            placeholder="Your message here..."
                            rows="6"
                            required
                            className={styles.textarea}
                        />
                    </div>
                    <button 
                        type="submit" 
                        className={styles.submitButton}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Sending...' : 'Send Message'}
                    </button>
                </form>
                {status && (
                    <p className={`${styles.status} ${status.includes('Error') ? styles.error : styles.success}`}>
                        {status}
                    </p>
                )}
            </div>
        </div>
    );
}
