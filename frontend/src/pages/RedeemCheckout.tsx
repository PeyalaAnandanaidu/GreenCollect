import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaCoins, FaArrowLeft, FaMapMarkerAlt, FaTruck, FaCheck, FaShoppingCart } from 'react-icons/fa';
import { useCart } from '../contexts/CartContext';
import './RedeemCheckout.css';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  image: string;
}

interface Address {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

const RedeemCheckout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state || {}) as any;
  const product = state?.product as Product | undefined;
  const cartItems = state?.cartItems as Array<{ id: string; name: string; price: number; image?: string; qty: number }> | undefined;
  const cart = (() => {
    try { return useCart(); } catch { return null; }
  })();

  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const [address, setAddress] = useState<Address>({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India'
  });

  const [deliveryOption, setDeliveryOption] = useState<'standard' | 'express'>('standard');
  const [userCoins, setUserCoins] = useState(0);

  // ✅ Load user from correct storage + use POINTS (correct field)
  useEffect(() => {
    try {
      const loginMethod =
        localStorage.getItem('loginMethod') || sessionStorage.getItem('loginMethod');

      const storage = loginMethod === 'local' ? localStorage : sessionStorage;
      const userDataRaw = storage.getItem('user');

      if (userDataRaw) {
        const user = JSON.parse(userDataRaw);
        const balance = Number(user.points ?? user.coins ?? 0);

        setUserCoins(isNaN(balance) ? 0 : balance);

        setAddress(prev => ({
          ...prev,
          fullName: user.name || '',
          email: user.email || '',
          phone: user.phone || ''
        }));
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  }, []);

  if (!product && (!cartItems || cartItems.length === 0)) {
    return (
      <div className="checkout-page">
        <div className="checkout-container">
          <div className="error-card">
            <h2>No Product or Cart Selected</h2>
            <p>Please select a product or add items to your cart to proceed with checkout.</p>
            <button className="btn-primary" onClick={() => navigate('/dashboard')}>
              <FaShoppingCart /> Back to Store
            </button>
          </div>
        </div>
      </div>
    );
  }

  const deliveryCost = deliveryOption === 'express' ? 25 : 0;
  const itemsTotal = product ? product.price : (cartItems ? cartItems.reduce((s, it) => s + (it.price * (it.qty || 1)), 0) : 0);
  const totalCost = itemsTotal + deliveryCost;
  const canAfford = userCoins >= totalCost;

  const validateAddress = () =>
    address.fullName.trim().length >= 2 &&
    address.phone.trim().length >= 10 &&
    address.address.trim().length >= 5 &&
    address.city.trim().length >= 2 &&
    address.state.trim().length >= 2 &&
    address.pincode.trim().length >= 5;

  const handleNext = () => {
    if (currentStep === 1 && validateAddress()) {
      setCurrentStep(2);
    } else if (currentStep === 2) {
      setCurrentStep(3);
    }
  };

  // ✅ Place Order — deduct POINTS correctly
  const handlePlaceOrder = async () => {
    if (!canAfford) return;

    setIsLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      const orderId = `GC-${Date.now().toString().slice(-8)}`;

      // If single product flow
      if (product) {
        const orderData = {
          orderId,
          product,
          address,
          deliveryOption,
          totalCost,
          createdAt: new Date().toISOString(),
        };

        const existingOrders = JSON.parse(localStorage.getItem('redeem.orders') || '[]');
        existingOrders.push(orderData);
        localStorage.setItem('redeem.orders', JSON.stringify(existingOrders));
      }

      // If cart flow
      if (cartItems && cartItems.length > 0) {
        const orderData = {
          orderId,
          items: cartItems,
          address,
          deliveryOption,
          totalCost,
          createdAt: new Date().toISOString(),
        };
        const existingOrders = JSON.parse(localStorage.getItem('redeem.orders') || '[]');
        existingOrders.push(orderData);
        localStorage.setItem('redeem.orders', JSON.stringify(existingOrders));

        // Clear cart via context if available
        try {
          cart?.clearCart();
        } catch (e) {
          // ignore if cart not available
        }
      }

      // ✅ Update user POINTS in correct storage
      const loginMethod =
        localStorage.getItem('loginMethod') || sessionStorage.getItem('loginMethod');

      const storage = loginMethod === 'local' ? localStorage : sessionStorage;

      const rawUser = storage.getItem('user') || '{}';
      const userData = JSON.parse(rawUser);

      const currentPoints = Number(userData.points ?? userData.coins ?? 0);
      userData.points = Math.max(0, currentPoints - totalCost);

      storage.setItem('user', JSON.stringify(userData));

      navigate('/order-success', {
        state: {
          orderId,
          product: product || undefined,
          totalCoins: totalCost,
        },
      });

    } catch (error) {
      console.error('Error placing order:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderStepIndicator = () => (
    <div className="step-indicator">
      <div className={`step ${currentStep >= 1 ? 'active' : ''} ${currentStep > 1 ? 'completed' : ''}`}>
        <div className="step-circle">{currentStep > 1 ? <FaCheck /> : <FaMapMarkerAlt />}</div>
        <span>Address</span>
      </div>
      <div className="step-line"></div>
      <div className={`step ${currentStep >= 2 ? 'active' : ''} ${currentStep > 2 ? 'completed' : ''}`}>
        <div className="step-circle">{currentStep > 2 ? <FaCheck /> : <FaTruck />}</div>
        <span>Delivery</span>
      </div>
      <div className="step-line"></div>
      <div className={`step ${currentStep >= 3 ? 'active' : ''}`}>
        <div className="step-circle">
          <FaCheck />
        </div>
        <span>Review</span>
      </div>
    </div>
  );

  const renderAddressForm = () => (
    <div className="form-section">
      <h3>Delivery Address</h3>
      <div className="form-grid">
        <div className="form-group">
          <label>Full Name *</label>
          <input
            type="text"
            value={address.fullName}
            onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
            placeholder="Enter your full name"
            required
          />
        </div>
        <div className="form-group">
          <label>Phone Number *</label>
          <input
            type="tel"
            value={address.phone}
            onChange={(e) => setAddress({ ...address, phone: e.target.value })}
            placeholder="Enter your phone number"
            required
          />
        </div>
        <div className="form-group full-width">
          <label>Email</label>
          <input
            type="email"
            value={address.email}
            onChange={(e) => setAddress({ ...address, email: e.target.value })}
            placeholder="Enter your email address"
          />
        </div>
        <div className="form-group full-width">
          <label>Address *</label>
          <textarea
            value={address.address}
            onChange={(e) => setAddress({ ...address, address: e.target.value })}
            placeholder="Enter your complete address"
            rows={3}
            required
          />
        </div>
        <div className="form-group">
          <label>City *</label>
          <input
            type="text"
            value={address.city}
            onChange={(e) => setAddress({ ...address, city: e.target.value })}
            placeholder="Enter city"
            required
          />
        </div>
        <div className="form-group">
          <label>State *</label>
          <input
            type="text"
            value={address.state}
            onChange={(e) => setAddress({ ...address, state: e.target.value })}
            placeholder="Enter state"
            required
          />
        </div>
        <div className="form-group">
          <label>Pincode *</label>
          <input
            type="text"
            value={address.pincode}
            onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
            placeholder="Enter pincode"
            required
          />
        </div>
        <div className="form-group">
          <label>Country</label>
          <input
            type="text"
            value={address.country}
            onChange={(e) => setAddress({ ...address, country: e.target.value })}
            placeholder="Enter country"
          />
        </div>
      </div>
    </div>
  );

  const renderDeliveryOptions = () => (
    <div className="form-section">
      <h3>Delivery Options</h3>
      <div className="delivery-options">
        <label className={`delivery-option ${deliveryOption === 'standard' ? 'selected' : ''}`}>
          <input
            type="radio"
            name="delivery"
            value="standard"
            checked={deliveryOption === 'standard'}
            onChange={() => setDeliveryOption('standard')}
          />
          <div className="option-content">
            <div className="option-title">Standard Delivery</div>
            <div className="option-subtitle">5-7 business days • Free</div>
          </div>
          <div className="option-price">Free</div>
        </label>
        <label className={`delivery-option ${deliveryOption === 'express' ? 'selected' : ''}`}>
          <input
            type="radio"
            name="delivery"
            value="express"
            checked={deliveryOption === 'express'}
            onChange={() => setDeliveryOption('express')}
          />
          <div className="option-content">
            <div className="option-title">Express Delivery</div>
            <div className="option-subtitle">2-3 business days</div>
          </div>
          <div className="option-price">
            <FaCoins /> 25
          </div>
        </label>
      </div>
    </div>
  );

  const renderOrderReview = () => (
    <div className="form-section">
      <h3>Order Review</h3>
      <div className="review-content">
        <div className="address-review">
          <h4>Delivery Address</h4>
          <p>
            {address.fullName}<br />
            {address.address}<br />
            {address.city}, {address.state} {address.pincode}<br />
            {address.country}<br />
            Phone: {address.phone}
          </p>
        </div>
        <div className="delivery-review">
          <h4>Delivery Option</h4>
          <p>
            {deliveryOption === 'standard'
              ? 'Standard Delivery (Free)'
              : 'Express Delivery (25 coins)'}
            <br />
            {deliveryOption === 'standard'
              ? '5-7 business days'
              : '2-3 business days'}
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        {/* Header */}
        <div className="checkout-header">
          <button className="back-btn" onClick={() => navigate(-1)}>
            <FaArrowLeft /> Back
          </button>
          <h1>Checkout</h1>
        </div>

        {/* Step Indicator */}
        {renderStepIndicator()}

        <div className="checkout-content">
          {/* Main Content */}
          <div className="checkout-main">
            {currentStep === 1 && renderAddressForm()}
            {currentStep === 2 && renderDeliveryOptions()}
            {currentStep === 3 && renderOrderReview()}

            {/* Navigation Buttons */}
            <div className="checkout-actions">
              {currentStep > 1 && (
                <button
                  className="btn-secondary"
                  onClick={() => setCurrentStep(currentStep - 1)}
                >
                  Previous
                </button>
              )}
              {currentStep < 3 ? (
                <button
                  className="btn-primary"
                  onClick={handleNext}
                  disabled={currentStep === 1 && !validateAddress()}
                >
                  Next
                </button>
              ) : (
                <button
                  className={`btn-primary ${!canAfford ? 'disabled' : ''}`}
                  onClick={handlePlaceOrder}
                  disabled={!canAfford || isLoading}
                >
                  {isLoading ? 'Placing Order...' : `Place Order (${totalCost} coins)`}
                </button>
              )}
            </div>

            {!canAfford && currentStep === 3 && (
              <div className="insufficient-coins">
                <p>
                  Insufficient coins! You need {totalCost} coins but have {userCoins} coins.
                </p>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="order-summary">
            <h3>Order Summary</h3>
            {cartItems && cartItems.length > 0 ? (
              <div className="product-summary">
                {cartItems.map((it) => (
                  <div className="cart-item-summary" key={it.id} style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'center' }}>
                    {it.image && <img src={it.image} alt={it.name} style={{ width: 56, height: 56, objectFit: 'cover', borderRadius: 6 }} />}
                    <div className="product-info">
                      <h4 style={{ margin: 0 }}>{it.name} <small style={{ fontWeight: 600 }}>x{it.qty}</small></h4>
                      <p style={{ margin: 0, fontSize: 12 }}><FaCoins /> {it.price} each</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="product-summary">
                <img src={product.image} alt={product.name} />
                <div className="product-info">
                  <h4>{product.name}</h4>
                  <p>{product.category}</p>
                </div>
              </div>
            )}

            <div className="price-breakdown">
              {cartItems && cartItems.length > 0 ? (
                <>
                  <div className="price-item">
                    <span>Subtotal</span>
                    <span>
                      <FaCoins /> {itemsTotal}
                    </span>
                  </div>
                </>
              ) : (
                <div className="price-item">
                  <span>Product Price</span>
                  <span>
                    <FaCoins /> {product.price}
                  </span>
                </div>
              )}
              <div className="price-item">
                <span>Delivery</span>
                <span>
                  {deliveryCost === 0 ? (
                    'Free'
                  ) : (
                    <>
                      <FaCoins /> {deliveryCost}
                    </>
                  )}
                </span>
              </div>
              <div className="price-divider"></div>
              <div className="price-item total">
                <span>Total</span>
                <span>
                  <FaCoins /> {totalCost}
                </span>
              </div>
            </div>
            <div className="coins-info">
              <div className="available-coins">
                Available Coins: <strong>{userCoins}</strong>
              </div>
              <div className="remaining-coins">
                After Purchase:{' '}
                <strong>{userCoins - totalCost}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RedeemCheckout;
