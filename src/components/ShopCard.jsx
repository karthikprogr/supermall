import { Link } from 'react-router-dom';

const ShopCard = ({ shop, viewLink }) => {
  const defaultLink = `/admin/view-shop/${shop.id}`;
  
  return (
    <div className="glass-card shop-card" style={{display: 'flex', flexDirection: 'column', overflow: 'hidden'}}>
      <div className="mall-image" style={{height: '220px', position: 'relative', background: '#1e293b', overflow: 'hidden'}}>
        <img 
          src={shop.imageURL || `https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80`} 
          alt={shop.shopName} 
          style={{width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease', transformOrigin: 'center'}}
          className="hover-zoom-img"
        />
        <span className="mall-badge" style={{
          position: 'absolute', top: '1rem', right: '1rem', 
          background: 'var(--primary)', color: '#fff', 
          fontWeight: 800, textTransform: 'uppercase', fontSize: '0.7rem',
          padding: '0.4rem 1rem', borderRadius: '20px', letterSpacing: '0.05em',
          boxShadow: '0 4px 15px rgba(99, 102, 241, 0.4)', border: 'none'
        }}>
          {shop.category}
        </span>

      </div>
      
      <div className="mall-info" style={{padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column'}}>
        <h3 style={{fontSize: '1.4rem', marginBottom: '0.75rem'}}>{shop.shopName}</h3>
        
        <div className="mall-location" style={{marginBottom: '1rem'}}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{marginRight: '0.4rem'}}>
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
          Floor: {shop.floor}
        </div>
        
        {shop.description && (
          <p className="mall-description" style={{fontSize: '0.9rem', marginBottom: '1.5rem', opacity: 0.8}}>
            {shop.description}
          </p>
        )}
        
        <div className="mall-card-cta" style={{marginTop: 'auto', paddingTop: '1rem'}}>
          <Link to={viewLink || defaultLink} className="btn btn-primary" style={{width: '100%', gap: '0.8rem'}}>
            View Details
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
            </svg>
          </Link>
        </div>
      </div>
    </div>


  );
};

export default ShopCard;
