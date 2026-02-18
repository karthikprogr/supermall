import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useUserContext } from "../../contexts/UserContext";
import ProductCard from "../../components/ProductCard";
import { db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";

const UserSavedItems = () => {
  const { currentUser } = useAuth();
  const { savedItems, toggleSavedItem } = useUserContext();
  const [savedProducts, setSavedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSavedItems = async () => {
      if (!currentUser?.uid || savedItems.length === 0) {
        setSavedProducts([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // Fetch product details for all saved items
        const products = [];
        for (const productId of savedItems) {
          try {
            const productDoc = await getDoc(doc(db, "products", productId));
            if (productDoc.exists()) {
              products.push({
                id: productDoc.id,
                ...productDoc.data(),
              });
            }
          } catch (err) {
            console.error(`Error fetching product ${productId}:`, err);
          }
        }

        setSavedProducts(products);
      } catch (err) {
        console.error("Error fetching saved items:", err);
        setError("Failed to load saved items");
      } finally {
        setLoading(false);
      }
    };

    fetchSavedItems();
  }, [currentUser?.uid, savedItems]);

  const handleRemoveSaved = (productId) => {
    // Use the existing toggleSavedItem from UserContext
    toggleSavedItem(productId);
  };

  if (loading) {
    return (
      <div className="saved-items-container">
        <div className="loading">
          <p>Loading your saved items...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="saved-items-container">
      <div className="saved-items-header">
        <h1>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" style={{verticalAlign: 'middle', marginRight: '0.5rem'}}>
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
          </svg>
          Saved Items
        </h1>
        <p className="saved-count">You have {savedProducts.length} saved product{savedProducts.length !== 1 ? 's' : ''}</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      {savedProducts.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
            </svg>
          </div>
          <h2>No Saved Items Yet</h2>
          <p>Start exploring and save your favorite products!</p>
          <a href="/user/products" className="btn-explore">
            Explore Products
          </a>
        </div>
      ) : (
        <div className="saved-items-grid">
          {savedProducts.map((product) => (
            <div key={product.id} className="saved-item-wrapper">
              <ProductCard product={product} showCompare={false} showSaveButton={false} />
              <button
                onClick={() => handleRemoveSaved(product.id)}
                className="btn-remove-saved"
                title="Remove from saved"
              >
                ✕ Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserSavedItems;
