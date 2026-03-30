import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import { useUserContext } from '../../contexts/UserContext';
import AsyncState from '../../components/AsyncState';

const MALL_IMAGES = [
  '/images/mall_1.png', // Premium Exterior
  '/images/mall_2.png', // Premium Interior 
  'https://images.unsplash.com/photo-1541339902099-13d44299127d?q=80&w=1000&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?q=80&w=1000&auto=format&fit=crop'
];


const MallSelection = () => {
  const [malls, setMalls] = useState([]);
  const [filteredMalls, setFilteredMalls] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('nameAsc');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { setSelectedMall } = useUserContext();
  const navigate = useNavigate();

  // Helper to get consistent mall image
  const getMallImage = (mall) => {
    if (mall.imageURL) return mall.imageURL;
    
    const name = (mall.mallName || '').toLowerCase();
    // Explicit mapping for demo malls to ensure they are DIFFERENT
    if (name.includes('rithik')) return MALL_IMAGES[1]; // Premium Interior
    if (name.includes('my mall')) return MALL_IMAGES[0]; // Premium Exterior
    
    // Fallback hash for other malls
    const charCodeSum = (mall.mallName || '').split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
    return MALL_IMAGES[charCodeSum % MALL_IMAGES.length];
  };


  useEffect(() => {
    fetchMalls();
  }, []);

  useEffect(() => {
    let nextMalls = [...malls];

    if (searchTerm) {
      const filtered = malls.filter(mall =>
        mall.mallName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (mall.location && mall.location.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (mall.description && mall.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      nextMalls = filtered;
    }

    if (sortBy === 'nameAsc') {
      nextMalls.sort((a, b) => (a.mallName || '').localeCompare(b.mallName || ''));
    } else if (sortBy === 'nameDesc') {
      nextMalls.sort((a, b) => (b.mallName || '').localeCompare(a.mallName || ''));
    } else if (sortBy === 'locationAsc') {
      nextMalls.sort((a, b) => (a.location || '').localeCompare(b.location || ''));
    }

    setFilteredMalls(nextMalls);
  }, [searchTerm, sortBy, malls]);

  const fetchMalls = async () => {
    try {
      setError('');
      setLoading(true);
      const mallsSnapshot = await getDocs(collection(db, 'malls'));
      const mallsData = mallsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMalls(mallsData);
      setFilteredMalls(mallsData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching malls:', error);
      setError('Unable to load malls right now. Please retry.');
      setLoading(false);
    }
  };

  const handleMallSelect = (mall) => {
    setSelectedMall({
      id: mall.id,
      name: mall.mallName,
      location: mall.location,
      ...mall
    });
    navigate('/user/shops');
  };

  if (loading) {
    return <div className="loading">Loading malls...</div>;
  }

  const totalMalls = malls.length;
  const uniqueCities = new Set(malls.map((mall) => (mall.location || '').trim()).filter(Boolean)).size;
  const withImages = malls.filter((mall) => Boolean(mall.imageURL)).length;
  const hasActiveSearch = Boolean(searchTerm.trim());
  const featuredMalls = filteredMalls.slice(0, 2);
  const remainingMalls = filteredMalls.slice(2);

  return (
    <div className="mall-selection-page">
      <div className="mall-selection-hero">
        <span className="orb-left" aria-hidden="true"></span>
        <span className="orb-right" aria-hidden="true"></span>
        <span className="mall-selection-pill">Super Mall Ecosystem</span>
        <h1 className="primary-gradient-text">Select your destination</h1>
        <p className="subtitle">Discover premium shops, exclusive offers, and smart shopping tools across our curated malls.</p>

        
        <div className="mall-selection-hero-stats">
          <div className="hero-stat-chip">
            <strong>{totalMalls}</strong>
            <span>Total Malls</span>
          </div>
          <div className="hero-stat-chip">
            <strong>{uniqueCities}</strong>
            <span>Cities</span>
          </div>
          <div className="hero-stat-chip">
            <strong>{malls.length > 0 ? 'Live' : '...'}</strong>
            <span>Status</span>
          </div>
        </div>
      </div>

      {error && (
        <AsyncState
          title="Could not fetch malls"
          message={error}
          actionLabel="Retry loading malls"
          onAction={fetchMalls}
        />
      )}

      {featuredMalls.length > 0 && !searchTerm && (
        <div className="featured-malls-section">
          <div className="section-heading-row">
            <h2>Featured Picks</h2>
            <span className="section-heading-meta">Top curated malls for quick exploration</span>
          </div>
          <div className="featured-malls-grid">
            {featuredMalls.map((mall, idx) => (
              <div key={mall.id} className="featured-mall-card" onClick={() => handleMallSelect(mall)}>
                <div className="featured-mall-image">
                  <img src={getMallImage(mall)} alt={mall.mallName} />
                </div>
                <div className="featured-mall-content">
                  <span className="featured-label">{idx === 0 ? 'Trending' : 'Recommended'}</span>
                  <h3>{mall.mallName}</h3>
                  <p>{mall.description || 'Explore popular shops, fresh offers, and trending collections in this premium destination.'}</p>
                  <div className="featured-location">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{marginRight: '0.25rem'}}>
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                    </svg>
                    {mall.location || 'Location available'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mall-selection-toolbar">
        <div className="filters-container">
          <div className="filter-group">
            <label>Live Mall Discovery</label>
            <input
              type="text"
              placeholder="Search by name, location or floor keywords..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="filter-input"
            />
          </div>
          <div className="filter-group" style={{maxWidth: '200px'}}>
            <label>Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="select-field"
            >
              <option value="nameAsc">A to Z</option>
              <option value="nameDesc">Z to A</option>
              <option value="locationAsc">Location</option>
            </select>
          </div>
        </div>
      </div>

      {!error && filteredMalls.length === 0 ? (
        <div className="empty-state">
          <p>{searchTerm ? `No malls found matching "${searchTerm}"` : 'No malls available at the moment'}</p>
        </div>
      ) : (
        <>
          <div className="section-heading-row">
            <h2>{searchTerm ? 'Search Results' : 'Explore All Malls'}</h2>
            <p className="section-heading-meta">Showing {filteredMalls.length} destinations</p>
          </div>
          
          <div className="malls-grid">
            {filteredMalls.map(mall => (
              <div 
                key={mall.id} 
                className="mall-card"
                onClick={() => handleMallSelect(mall)}
              >
                <div className="mall-image">
                  <img src={getMallImage(mall)} alt={mall.mallName} />
                </div>
                <div className="mall-info">
                  <h3>{mall.mallName}</h3>
                  {mall.location && (
                    <p className="mall-location">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                      </svg>
                      {mall.location}
                    </p>
                  )}
                  <p className="mall-description">{mall.description || 'Explore premium shops and exclusive offers.'}</p>
                  <div className="mall-meta enhanced">
                    <span className="mall-badge">Fast Connect</span>
                    <span className="mall-meta-chip">Multi-Floor</span>
                  </div>
                  <div className="mall-card-cta">
                    <button type="button" className="btn btn-primary" style={{width: '100%'}}>
                      Explore Destination
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </>
      )}
    </div>

  );
};

export default MallSelection;
