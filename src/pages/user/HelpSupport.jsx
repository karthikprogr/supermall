import { useState } from 'react';

const HelpSupport = () => {
  const [selectedCategory, setSelectedCategory] = useState('general');
  const [activeFaq, setActiveFaq] = useState(null);

  const faqs = {
    general: [
      { id: 1, question: 'How do I browse shops and products?', answer: 'Navigate to "Browse Shops" or "Products" from the menu. Select a super mall first, then browse available shops and products.' },
      { id: 2, question: 'How do I save items?', answer: 'Click the bookmark icon on any product to save it. You can view all saved items from your account page.' },
      { id: 3, question: 'Can I compare products?', answer: 'Yes! Select up to 4 products and click the compare button to see detailed comparison of features, prices, and offers.' }
    ],
    account: [
      { id: 4, question: 'How do I change my super mall?', answer: 'Go to your Account page and click "Change Mall" to select a different super mall.' },
      { id: 5, question: 'How do I view my saved items?', answer: 'From your Account page, click "Saved Items" to view all products you have bookmarked.' },
      { id: 6, question: 'How do I logout?', answer: 'Click the "Logout" button in your Account page or use the Logout button in the navbar.' }
    ],
    support: [
      { id: 10, question: 'I found a bug, how do I report it?', answer: 'Please contact our support team at support@supermall.com with details about the issue.' },
      { id: 11, question: 'Can I suggest a feature?', answer: 'We love feedback! Email your suggestions to feedback@supermall.com' }
    ]
  };

  return (
    <div className="admin-page container section-padding">
      <div className="page-header text-center">
        <h1 className="primary-gradient-text">Assistance Terminal</h1>
        <p className="subtitle">Operational support and technical documentation for shoppers</p>
      </div>

      <div className="form-card-wrapper">
        <div className="form-glass-card glass-card" style={{padding: '3rem'}}>
          
          <div className="contact-protocol-grid" style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '4rem'}}>
             <div style={{background: 'rgba(255,255,255,0.02)', border: '1px solid var(--glass-border)', borderRadius: '16px', padding: '1.5rem', textAlign: 'center'}}>
                <div style={{color: 'var(--primary)', marginBottom: '1rem'}}><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg></div>
                <h4 style={{fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem'}}>E-Mail</h4>
                <p style={{fontSize: '0.85rem', color: 'var(--text-muted)'}}>support@supermall.com</p>
             </div>
             <div style={{background: 'rgba(255,255,255,0.02)', border: '1px solid var(--glass-border)', borderRadius: '16px', padding: '1.5rem', textAlign: 'center'}}>
                <div style={{color: 'var(--secondary)', marginBottom: '1rem'}}><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg></div>
                <h4 style={{fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem'}}>Voice</h4>
                <p style={{fontSize: '0.85rem', color: 'var(--text-muted)'}}>+1-800-SUPER</p>
             </div>
             <div style={{background: 'rgba(255,255,255,0.02)', border: '1px solid var(--glass-border)', borderRadius: '16px', padding: '1.5rem', textAlign: 'center'}}>
                <div style={{color: 'var(--success)', marginBottom: '1rem'}}><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg></div>
                <h4 style={{fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem'}}>Live</h4>
                <p style={{fontSize: '0.85rem', color: 'var(--text-muted)'}}>Agent Dispatch</p>
             </div>
          </div>

          <div className="faq-terminal">
            <div style={{display: 'flex', gap: '1rem', marginBottom: '2rem'}}>
                {Object.keys(faqs).map(cat => (
                    <button key={cat} onClick={() => setSelectedCategory(cat)} className={`btn btn-sm ${selectedCategory === cat ? 'btn-primary' : 'btn-outline'}`} style={{flex: 1, justifyContent: 'center'}}>
                        {cat.toUpperCase()}
                    </button>
                ))}
            </div>

            <div className="faq-accordion" style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
                {faqs[selectedCategory].map(faq => (
                    <div key={faq.id} style={{background: 'rgba(255,255,255,0.01)', border: '1px solid var(--glass-border)', borderRadius: '12px', overflow: 'hidden'}}>
                        <button 
                            onClick={() => setActiveFaq(activeFaq === faq.id ? null : faq.id)}
                            style={{width: '100%', padding: '1.25rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'transparent', border: 'none', cursor: 'pointer', color: '#fff', textAlign: 'left'}}
                        >
                            <span style={{fontWeight: 600, fontSize: '0.95rem'}}>{faq.question}</span>
                            <span style={{color: 'var(--primary)', transition: '0.3s', transform: activeFaq === faq.id ? 'rotate(45deg)' : 'rotate(0deg)'}}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                            </span>
                        </button>
                        {activeFaq === faq.id && (
                            <div style={{padding: '0 1.5rem 1.5rem', color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.6'}}>
                                {faq.answer}
                            </div>
                        )}
                    </div>
                ))}
            </div>
          </div>

          <div style={{marginTop: '4rem', padding: '2rem', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), transparent)', border: '1px solid var(--glass-border)', borderRadius: '20px', textAlign: 'center'}}>
            <h3 style={{fontSize: '1.25rem', marginBottom: '0.5rem'}}>Still have technical inquiries?</h3>
            <p style={{color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '2rem'}}>Our specialized support cadre is available to assist with complex operational issues.</p>
            <button className="btn btn-primary btn-block" style={{justifyContent: 'center', padding: '1.25rem'}}>Initialize Support Ticket</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpSupport;
