const CompareModal = ({ products, onClose }) => {
  if (products.length === 0) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content compare-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Compare Products</h2>
          <button onClick={onClose} className="btn-close">×</button>
        </div>
        
        <div className="modal-body">
          {products.length < 2 ? (
            <p className="info-message">Select at least 2 products to compare</p>
          ) : (
            <div className="compare-grid">
              {products.map((product) => (
                <div key={product.id} className="compare-item">
                  {product.imageURL && (
                    <img src={product.imageURL} alt={product.name} className="compare-image" />
                  )}
                  <h3>{product.name}</h3>
                  <p className="compare-price">₹{product.price}</p>
                  <div className="compare-details">
                    <p><strong>Features:</strong> {product.features || 'N/A'}</p>
                    <p><strong>Shop:</strong> {product.shopName || 'N/A'}</p>
                    {product.offer && (
                      <p className="compare-offer">
                        🎉 {product.offer.discount}% OFF
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="modal-footer">
          <button onClick={onClose} className="btn btn-secondary">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompareModal;
