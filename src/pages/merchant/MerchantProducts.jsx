import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs, query, where, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../../contexts/AuthContext';
import { logProduct } from '../../utils/logger';
import ProductCard from '../../components/ProductCard';

const MerchantProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  useEffect(() => {
    fetchProducts();
  }, [currentUser]);

  const fetchProducts = async () => {
    try {
      const productsQuery = query(
        collection(db, 'products'),
        where('ownerId', '==', currentUser.uid)
      );
      const productsSnapshot = await getDocs(productsQuery);
      const productsData = productsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setProducts(productsData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setLoading(false);
    }
  };

  const handleDelete = async (productId, productName) => {
    if (!window.confirm(`Delete product "${productName}"?`)) {
      return;
    }

    try {
      await deleteDoc(doc(db, 'products', productId));
      await logProduct.delete(currentUser.uid, productName, productId);
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  if (loading) {
    return <div className="loading">Loading products...</div>;
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>My Products</h1>
        <Link to="/merchant/products/add" className="btn btn-primary">
          Add New Product
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="empty-state">
          <p>No products yet. Add your first product!</p>
          <Link to="/merchant/products/add" className="btn btn-primary">
            Add Product
          </Link>
        </div>
      ) : (
        <div className="cards-grid">
          {products.map(product => (
            <div key={product.id} className="card-wrapper">
              <ProductCard 
                product={product} 
                showCompare={false}
                onOfferDeleted={fetchProducts}
              />
              <div className="card-actions">
                <Link to={`/merchant/products/edit/${product.id}`} className="btn btn-sm">
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(product.id, product.name)}
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

export default MerchantProducts;
