import { Link } from 'react-router-dom';

const ShopCard = ({ shop, viewLink }) => {
  const defaultLink = `/admin/view-shop/${shop.id}`;
  
  return (
    <div className="card shop-card">
      <div className="card-header">
        <h3>{shop.shopName}</h3>
        <span className="badge">{shop.category}</span>
      </div>
      <div className="card-body">
        <p><strong>Floor:</strong> {shop.floor}</p>
        {shop.description && <p className="shop-description">{shop.description}</p>}
        <p><strong>Contact:</strong> {shop.contactNumber || 'N/A'}</p>
      </div>
      <div className="card-footer">
        <Link to={viewLink || defaultLink} className="btn btn-primary">
          View Details
        </Link>
      </div>
    </div>
  );
};

export default ShopCard;
