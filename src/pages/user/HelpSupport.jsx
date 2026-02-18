import { useState } from 'react';

const HelpSupport = () => {
  const [selectedCategory, setSelectedCategory] = useState('general');

  const handleLiveChatClick = () => {
    alert('Live Chat feature is coming soon! Please contact us via email or phone for immediate assistance.');
  };

  const faqs = {
    general: [
      {
        id: 1,
        question: 'How do I browse shops and products?',
        answer: 'Navigate to "Browse Shops" or "Products" from the menu. Select a super mall first, then browse available shops and products.'
      },
      {
        id: 2,
        question: 'How do I save items?',
        answer: 'Click the bookmark icon on any product to save it. You can view all saved items from your account page.'
      },
      {
        id: 3,
        question: 'Can I compare products?',
        answer: 'Yes! Select up to 4 products and click the compare button to see detailed comparison of features, prices, and offers.'
      }
    ],
    account: [
      {
        id: 4,
        question: 'How do I change my super mall?',
        answer: 'Go to your Account page and click "Change Mall" to select a different super mall.'
      },
      {
        id: 5,
        question: 'How do I view my saved items?',
        answer: 'From your Account page, click "Saved Items" to view all products you have bookmarked.'
      },
      {
        id: 6,
        question: 'How do I logout?',
        answer: 'Click the "Logout" button in your Account page or use the Logout button in the navbar.'
      }
    ],
    shopping: [
      {
        id: 7,
        question: 'How do I search for products?',
        answer: 'Use the search bar on the Products page to find products by name. You can also filter by category and floor.'
      },
      {
        id: 8,
        question: 'How do I check current offers?',
        answer: 'Click on "Active Offers" to see all current deals and discounts available at your selected mall.'
      },
      {
        id: 9,
        question: 'Can I see shop details?',
        answer: 'Yes! Click any shop card to view shop details, location, and all products available in that shop.'
      }
    ],
    support: [
      {
        id: 10,
        question: 'I found a bug, how do I report it?',
        answer: 'Please contact our support team at support@supermall.com with details about the issue.'
      },
      {
        id: 11,
        question: 'Can I suggest a feature?',
        answer: 'We love feedback! Email your suggestions to feedback@supermall.com'
      },
      {
        id: 12,
        question: 'Who do I contact for other issues?',
        answer: 'Reach out to our support team at support@supermall.com or call +1-800-SUPERMALL'
      }
    ]
  };

  const contactInfo = [
    {
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
          <polyline points="22,6 12,13 2,6"/>
        </svg>
      ),
      title: 'Email',
      value: 'support@supermall.com',
      description: 'We respond within 24 hours'
    },
    {
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
        </svg>
      ),
      title: 'Phone',
      value: '+1-800-SUPERMALL',
      description: 'Available 9 AM - 6 PM IST'
    },
    {
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
      ),
      title: 'Live Chat',
      value: 'Chat with us',
      description: 'Available during business hours'
    }
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Help & Support</h1>
        <p className="subtitle">Find answers and get assistance</p>
      </div>

      <div className="help-container">
        {/* Contact Info Section */}
        <div className="contact-section">
          <h2>Contact Us</h2>
          <div className="contact-grid">
            {contactInfo.map((contact, idx) => (
              <div 
                key={idx} 
                className={`contact-card ${contact.title === 'Live Chat' ? 'clickable' : ''}`}
                onClick={contact.title === 'Live Chat' ? handleLiveChatClick : undefined}
                style={contact.title === 'Live Chat' ? {cursor: 'pointer'} : undefined}
              >
                <div className="contact-icon">{contact.icon}</div>
                <h3>{contact.title}</h3>
                <p className="contact-value">{contact.value}</p>
                <p className="contact-description">{contact.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="faq-section">
          <h2>Frequently Asked Questions</h2>
          
          <div className="faq-categories">
            {Object.keys(faqs).map(category => (
              <button
                key={category}
                className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category)}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>

          <div className="faq-list">
            {faqs[selectedCategory].map(faq => (
              <div key={faq.id} className="faq-item">
                <div className="faq-question">
                  <h3>{faq.question}</h3>
                  <span className="faq-icon">+</span>
                </div>
                <p className="faq-answer">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Support CTA */}
        <div className="support-cta">
          <h2>Still need help?</h2>
          <p>Our support team is here to help you with any questions or concerns.</p>
          <button className="btn btn-primary">Contact Support</button>
        </div>
      </div>
    </div>
  );
};

export default HelpSupport;
