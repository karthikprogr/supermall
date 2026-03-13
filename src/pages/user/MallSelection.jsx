import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import { useUserContext } from '../../contexts/UserContext';
import AsyncState from '../../components/AsyncState';

const MallSelection = () => {
  const [malls, setMalls] = useState([]);
  const [filteredMalls, setFilteredMalls] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('nameAsc');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { setSelectedMall } = useUserContext();
  const navigate = useNavigate();

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
    <div className="page-container user-marketplace-page mall-selection-page">
      <div className="page-header mall-selection-hero">
        <span className="mall-selection-glow orb-left" aria-hidden="true" />
        <span className="mall-selection-glow orb-right" aria-hidden="true" />
        <span className="mall-selection-pill">User Dashboard</span>
        <h1>Select a Super Mall</h1>
        <p className="subtitle">Choose a mall to start exploring shops, products, and offers with smart discovery tools</p>
        <div className="mall-selection-hero-stats">
          <div className="hero-stat-chip">
            <strong>{totalMalls}</strong>
            <span>Total Malls</span>
          </div>
          <div className="hero-stat-chip">
            <strong>{uniqueCities}</strong>
            <span>Locations</span>
          </div>
          <div className="hero-stat-chip">
            <strong>{withImages}</strong>
            <span>With Visuals</span>
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

      {featuredMalls.length > 0 && (
        <div className="featured-malls-section">
          <div className="section-heading-row">
            <h2>Featured Picks</h2>
            <span className="section-heading-meta">Top curated malls for quick exploration</span>
          </div>
          <div className="featured-malls-grid">
            {featuredMalls.map((mall) => (
              <div key={mall.id} className="featured-mall-card" onClick={() => handleMallSelect(mall)}>
                <div className="featured-mall-content">
                  <span className="featured-label">Trending</span>
                  <h3>{mall.mallName}</h3>
                  <p>{mall.description || 'Explore popular shops, fresh offers, and trending collections.'}</p>
                  <div className="featured-location">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{verticalAlign: 'middle', marginRight: '0.25rem'}}>
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                      <circle cx="12" cy="10" r="3"/>
                    </svg>
                    {mall.location || 'Location coming soon'}
                  </div>
                </div>
                {mall.imageURL && (
                  <div className="featured-mall-image">
                    <img src={mall.imageURL} alt={mall.mallName} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mall-selection-toolbar">
        <div className="filters-container">
          <div className="filter-group">
            <label>Search Super Malls</label>
            <input
              type="text"
              placeholder="Search by mall name, location or keywords..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="filter-input"
            />
          </div>
          <div className="filter-group mall-sort-group">
            <label>Sort</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="select-field"
            >
              <option value="nameAsc">Mall Name: A to Z</option>
              <option value="nameDesc">Mall Name: Z to A</option>
              <option value="locationAsc">Location: A to Z</option>
            </select>
          </div>
          {hasActiveSearch && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setSearchTerm('')}
            >
              Clear Search
            </button>
          )}
        </div>

        <div className="mall-selection-summary">
          <span className="summary-pill">Showing {filteredMalls.length} of {totalMalls}</span>
          {searchTerm && <span className="summary-pill">Query: {searchTerm}</span>}
        </div>
      </div>

      {!error && filteredMalls.length === 0 ? (
        <div className="empty-state">
          <p>{searchTerm ? 'No malls found matching your search' : 'No malls available at the moment'}</p>
        </div>
      ) : (
        <>
          {remainingMalls.length > 0 && (
            <div className="section-heading-row secondary">
              <h2>All Super Malls</h2>
              <span className="section-heading-meta">Browse all available malls and pick your next visit</span>
            </div>
          )}
          <div className="malls-grid">
            {(remainingMalls.length > 0 ? remainingMalls : filteredMalls).map(mall => (
            <div 
              key={mall.id} 
              className="mall-card"
              onClick={() => handleMallSelect(mall)}
            >
              {mall.imageURL && (
                <div className="mall-image">
                  <img src={mall.imageURL} alt={mall.mallName} />
                </div>
              )}
              <div className="mall-info">
                <h3>{mall.mallName}</h3>
                {mall.location && (
                  <p className="mall-location">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{verticalAlign: 'middle', marginRight: '0.25rem'}}>
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                      <circle cx="12" cy="10" r="3"/>
                    </svg>
                    {mall.location}
                  </p>
                )}
                <p className="mall-description">{mall.description || 'Explore premium shops, products, and offers in this mall.'}</p>
                <div className="mall-meta enhanced">
                  <span className="mall-badge">Click to Explore</span>
                  <span className="mall-meta-chip">Shops & Products</span>
                  <span className="mall-meta-chip subtle">Smart Filters</span>
                </div>
                <div className="mall-card-cta">
                  <button type="button" className="btn btn-primary btn-sm">
                    Explore Now
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
