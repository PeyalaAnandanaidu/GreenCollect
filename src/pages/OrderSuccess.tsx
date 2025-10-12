import { useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaCheckCircle, FaCoins, FaChevronLeft } from 'react-icons/fa';
import './OrderSuccess.css';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  image: string;
}

const OrderSuccess: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state || {}) as {
    orderId?: string;
    product?: Product;
    totalCoins?: number;
  };

  const latest = useMemo(() => {
    try {
      const arr = JSON.parse(localStorage.getItem('redeem.orders') || '[]');
      return Array.isArray(arr) && arr.length > 0 ? arr[arr.length - 1] : null;
    } catch {
      return null;
    }
  }, []);

  const orderId = state.orderId || latest?.orderId;
  const product = state.product || latest?.product;
  const totalCoins = state.totalCoins || (product ? product.price : undefined);

  useEffect(() => {
    // If nothing to show, go back to dashboard
    if (!orderId) {
      navigate('/dashboard', { replace: true });
    }
  }, [orderId, navigate]);

  if (!orderId) return null;

  return (
    <div className="success-page">
      <div className="success-container">
        <div className="header-row animate-in">
          <button className="back-btn" onClick={() => navigate('/dashboard')}>
            <FaChevronLeft /> Dashboard
          </button>
          <h1 className="title">Order Success</h1>
        </div>

        <div className="success-card animate-in delay-1">
          <div className="success-icon"><FaCheckCircle /></div>
          <div className="success-title">Order Placed Successfully!</div>
          <div className="success-sub">Order ID: <strong>{orderId}</strong></div>
          {product && (
            <div className="product-row">
              <img src={product.image} alt={product.name} />
              <div className="product-info">
                <div className="name" title={product.name}>{product.name}</div>
                <div className="category">{product.category}</div>
              </div>
            </div>
          )}
          {typeof totalCoins === 'number' && (
            <div className="total-coins">
              <span>Coins Spent</span>
              <span className="coins"><FaCoins /> {totalCoins}</span>
            </div>
          )}
          <div className="eta">Estimated delivery: 3-5 days</div>
          <div className="success-actions">
            <button className="btn btn-yellow" onClick={() => navigate('/dashboard')}>Go to Dashboard</button>
            <button className="btn btn-outline" onClick={() => navigate('/')}>Continue Shopping</button>
            <button className="btn btn-outline" onClick={() => navigate('/status')}>Track Order</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
