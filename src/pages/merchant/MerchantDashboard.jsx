import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../../contexts/AuthContext';

const MerchantDashboard = () => {
  const [stats, setStats] = useState({
    myShops: 0,
    myProducts: 0,
    myOffers: 0
  });
  const [recentShops, setRecentShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  useEffect(() => {
    fetchData();
  }, [currentUser]);

  const fetchData = async () => {
    try {
      // Fetch merchant's shops
      const shopsQuery = query(
        collection(db, 'shops'),
        where('ownerId', '==', currentUser.uid)
      );
      const shopsSnapshot = await getDocs(shopsQuery);
      const shopsData = shopsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setRecentShops(shopsData.slice(0, 3));

      // Fetch merchant's products
      const productsQuery = query(
        collection(db, 'products'),
        where('ownerId', '==', currentUser.uid)
      );
      const productsSnapshot = await getDocs(productsQuery);

      // Fetch merchant's offers
      const offersQuery = query(
        collection(db, 'offers'),
        where('ownerId', '==', currentUser.uid)
      );
      const offersSnapshot = await getDocs(offersQuery);

      setStats({
        myShops: shopsData.length,
        myProducts: productsSnapshot.size,
        myOffers: offersSnapshot.size
      });

      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="dashboard-page">
      <h1>Merchant Dashboard</h1>
      
      <div className="stats-grid">
        <div className="stat-card">
          <h3>{stats.myShops}</h3>
          <p>My Shops</p>
        </div>
        <div className="stat-card">
          <h3>{stats.myProducts}</h3>
          <p>My Products</p>
        </div>
        <div className="stat-card">
          <h3>{stats.myOffers}</h3>
          <p>Active Offers</p>
        </div>
      </div>

      <div className="dashboard-actions">
        <Link to="/merchant/shops/create" className="btn btn-primary">
          Create New Shop
        </Link>
        <Link to="/merchant/products/add" className="btn btn-secondary">
          Add Product
        </Link>
        <Link to="/merchant/offers/create" className="btn btn-secondary">
          Create Offer
        </Link>
      </div>

      <div className="dashboard-section">
        <h2>Recent Shops</h2>
        {recentShops.length === 0 ? (
          <p className="empty-message">No shops yet. Create your first shop!</p>
        ) : (
          <div className="list-container">
            {recentShops.map(shop => (
              <div key={shop.id} className="list-item">
                <div>
                  <strong>{shop.shopName}</strong>
                  <p>{shop.category} - {shop.floor}</p>
                </div>
                <Link to="/merchant/products" className="btn btn-sm">
                  View
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MerchantDashboard;
