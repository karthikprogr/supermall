import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs, query, where, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../../contexts/AuthContext';
import { logShop } from '../../utils/logger';
import ShopCard from '../../components/ShopCard';

const MerchantShops = () => {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  useEffect(() => {
    fetchShops();
  }, [currentUser]);

  const fetchShops = async () => {
    try {
      const shopsQuery = query(
        collection(db, 'shops'),
        where('ownerId', '==', currentUser.uid)
      );
      const shopsSnapshot = await getDocs(shopsQuery);
      const shopsData = shopsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setShops(shopsData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching shops:', error);
      setLoading(false);
    }
  };

  const handleDelete = async (shopId, shopName) => {
    if (!window.confirm(`Delete shop "${shopName}"? This will also delete all associated products.`)) {
      return;
    }

    try {
      await deleteDoc(doc(db, 'shops', shopId));
      await logShop.delete(currentUser.uid, shopName, shopId);
      fetchShops();
    } catch (error) {
      console.error('Error deleting shop:', error);
    }
  };

  if (loading) {
    return <div className="loading">Loading shops...</div>;
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>My Shops</h1>
        <Link to="/merchant/shops/create" className="btn btn-primary">
          Create New Shop
        </Link>
      </div>

      {shops.length === 0 ? (
        <div className="empty-state">
          <p>No shops yet. Create your first shop to get started!</p>
          <Link to="/merchant/shops/create" className="btn btn-primary">
            Create Shop
          </Link>
        </div>
      ) : (
        <div className="cards-grid">
          {shops.map(shop => (
            <div key={shop.id} className="card-wrapper">
              <ShopCard shop={shop} />
              <div className="card-actions">
                <Link to={`/merchant/shops/edit/${shop.id}`} className="btn btn-sm">
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(shop.id, shop.shopName)}
                  className="btn btn-danger btn-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MerchantShops;
