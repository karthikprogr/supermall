import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import { useUserContext } from '../../contexts/UserContext';

const MallSelection = () => {
  const [malls, setMalls] = useState([]);
  const [filteredMalls, setFilteredMalls] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const { setSelectedMall } = useUserContext();
  const navigate = useNavigate();

  useEffect(() => {
    fetchMalls();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = malls.filter(mall =>
        mall.mallName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (mall.location && mall.location.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (mall.description && mall.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredMalls(filtered);
    } else {
      setFilteredMalls(malls);
    }
  }, [searchTerm, malls]);

  const fetchMalls = async () => {
    try {
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

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Select a Super Mall</h1>
        <p className="subtitle">Choose a mall to start exploring shops, products, and offers</p>
      </div>

      <div className="filters-container">
        <div className="filter-group">
          <label>Search Super Malls</label>
          <input
            type="text"
            placeholder="Search by mall name or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="filter-input"
          />
        </div>
      </div>

      {filteredMalls.length === 0 ? (
        <div className="empty-state">
          <p>{searchTerm ? 'No malls found matching your search' : 'No malls available at the moment'}</p>
        </div>
      ) : (
        <div className="malls-grid">
          {filteredMalls.map(mall => (
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
                <p className="mall-description">{mall.description}</p>
                <div className="mall-meta">
                  <span className="mall-badge">Click to Explore</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MallSelection;
