import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaCoins, FaArrowLeft, FaMapMarkerAlt, FaTruck, FaCheck, FaShoppingCart } from 'react-icons/fa';
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
  const product = (location.state as { product?: Product })?.product;

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

  useEffect(() => {
    // Load user data and coins
    try {
      const userData = localStorage.getItem('user');
      if (userData) {
        const user = JSON.parse(userData);
        setUserCoins(user.coins || 0);
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

  if (!product) {
    return (
      <div className="checkout-page">
        <div className="checkout-container">
          <div className="error-card">
            <h2>No Product Selected</h2>
            <p>Please select a product from the Eco Store to proceed with checkout.</p>
            <button className="btn-primary" onClick={() => navigate('/dashboard')}>
              <FaShoppingCart /> Back to Store
            </button>
          </div>
        </div>
      </div>
    );
  }

  const deliveryCost = deliveryOption === 'express' ? 25 : 0;
  const totalCost = product.price + deliveryCost;
  const canAfford = userCoins >= totalCost;

  const validateAddress = () => {
    return (
      address.fullName.trim().length >= 2 &&
      address.phone.trim().length >= 10 &&
      address.address.trim().length >= 5 &&
      address.city.trim().length >= 2 &&
      address.state.trim().length >= 2 &&
      address.pincode.trim().length >= 5
    );
  };

  const handleNext = () => {
    if (currentStep === 1 && validateAddress()) {
      setCurrentStep(2);
    } else if (currentStep === 2) {
      setCurrentStep(3);
    }
  };

  const handlePlaceOrder = async () => {
    if (!canAfford) return;
    
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const orderId = `GC-${Date.now().toString().slice(-8)}`;
      const orderData = {
        orderId,
        product,
        address,
        deliveryOption,
        totalCost,
        createdAt: new Date().toISOString()
      };
      
      // Save order to localStorage
      const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
      existingOrders.push(orderData);
      localStorage.setItem('orders', JSON.stringify(existingOrders));
      
      // Update user coins
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      userData.coins = (userData.coins || 0) - totalCost;
      localStorage.setItem('user', JSON.stringify(userData));
      
      navigate('/order-success', { 
        state: { 
          orderId, 
          product, 
          totalCoins: totalCost 
        } 
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
        <div className="step-circle">
          {currentStep > 1 ? <FaCheck /> : <FaMapMarkerAlt />}
        </div>
        <span>Address</span>
      </div>
      <div className="step-line"></div>
      <div className={`step ${currentStep >= 2 ? 'active' : ''} ${currentStep > 2 ? 'completed' : ''}`}>
        <div className="step-circle">
          {currentStep > 2 ? <FaCheck /> : <FaTruck />}
        </div>
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
            onChange={(e) => setAddress({...address, fullName: e.target.value})}
            placeholder="Enter your full name"
            required
          />
        </div>
        <div className="form-group">
          <label>Phone Number *</label>
          <input
            type="tel"
            value={address.phone}
            onChange={(e) => setAddress({...address, phone: e.target.value})}
            placeholder="Enter your phone number"
            required
          />
        </div>
        <div className="form-group full-width">
          <label>Email</label>
          <input
            type="email"
            value={address.email}
            onChange={(e) => setAddress({...address, email: e.target.value})}
            placeholder="Enter your email address"
          />
        </div>
        <div className="form-group full-width">
          <label>Address *</label>
          <textarea
            value={address.address}
            onChange={(e) => setAddress({...address, address: e.target.value})}
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
            onChange={(e) => setAddress({...address, city: e.target.value})}
            placeholder="Enter city"
            required
          />
        </div>
        <div className="form-group">
          <label>State *</label>
          <input
            type="text"
            value={address.state}
            onChange={(e) => setAddress({...address, state: e.target.value})}
            placeholder="Enter state"
            required
          />
        </div>
        <div className="form-group">
          <label>Pincode *</label>
          <input
            type="text"
            value={address.pincode}
            onChange={(e) => setAddress({...address, pincode: e.target.value})}
            placeholder="Enter pincode"
            required
          />
        </div>
        <div className="form-group">
          <label>Country</label>
          <input
            type="text"
            value={address.country}
            onChange={(e) => setAddress({...address, country: e.target.value})}
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
            {deliveryOption === 'standard' ? 'Standard Delivery (Free)' : 'Express Delivery (25 coins)'}
            <br />
            {deliveryOption === 'standard' ? '5-7 business days' : '2-3 business days'}
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
                <p>Insufficient coins! You need {totalCost} coins but have {userCoins} coins.</p>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="order-summary">
            <h3>Order Summary</h3>
            <div className="product-summary">
              <img src={product.image} alt={product.name} />
              <div className="product-info">
                <h4>{product.name}</h4>
                <p>{product.category}</p>
              </div>
            </div>
            <div className="price-breakdown">
              <div className="price-item">
                <span>Product Price</span>
                <span><FaCoins /> {product.price}</span>
              </div>
              <div className="price-item">
                <span>Delivery</span>
                <span>{deliveryCost === 0 ? 'Free' : <><FaCoins /> {deliveryCost}</>}</span>
              </div>
              <div className="price-divider"></div>
              <div className="price-item total">
                <span>Total</span>
                <span><FaCoins /> {totalCost}</span>
              </div>
            </div>
            <div className="coins-info">
              <div className="available-coins">
                Available Coins: <strong>{userCoins}</strong>
              </div>
              <div className="remaining-coins">
                After Purchase: <strong>{userCoins - totalCost}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RedeemCheckout;
