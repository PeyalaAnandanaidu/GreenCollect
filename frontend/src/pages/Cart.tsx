import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTrash, FaCoins } from 'react-icons/fa';
import { useCart } from '../contexts/CartContext';
import './Cart.css';

const Cart: React.FC = () => {
  const { items, updateQty, removeFromCart, clearCart, totalCoins } = useCart();
  const navigate = useNavigate();
  // ordering state not required since checkout is handed to RedeemCheckout

  const total = useMemo(() => totalCoins(), [items]);

  const handlePlaceOrder = async () => {
    if (items.length === 0) return;
    // Navigate to the Redeem/Checkout page and pass cart items
    // RedeemCheckout will handle placing the order and clearing the cart
    navigate('/redeem', { state: { cartItems: items } });
  };

  return (
    <div className="cart-page">
      <div className="cart-header">
        <h2>Your Cart</h2>
        <p>{items.length} item(s)</p>
      </div>

      {items.length === 0 ? (
        <div className="empty-cart">
          <p>Your cart is empty. Browse the Eco Store to add items.</p>
          <button className="btn btn-primary" onClick={() => navigate('/redeem')}>Go to Store</button>
        </div>
      ) : (
        <div className="cart-content">
          <div className="cart-items">
            {items.map(item => (
              <div className="cart-item" key={item.id}>
                <img src={item.image} alt={item.name} />
                <div className="item-info">
                  <h4>{item.name}</h4>
                  <div className="price"><FaCoins /> {item.price} each</div>
                  <div className="qty-controls">
                    <button onClick={() => updateQty(item.id, item.qty - 1)}>-</button>
                    <span>{item.qty}</span>
                    <button onClick={() => updateQty(item.id, item.qty + 1)}>+</button>
                  </div>
                </div>
                <div className="item-actions">
                  <div className="subtotal">Total: <FaCoins /> {item.price * item.qty}</div>
                  <button className="btn btn-outline" onClick={() => removeFromCart(item.id)}><FaTrash /> Remove</button>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <h3>Order Summary</h3>
            <div className="summary-row">
              <span>Subtotal</span>
              <span><FaCoins /> {total}</span>
            </div>
            <div className="summary-row">
              <span>Delivery</span>
              <span><FaCoins /> 0</span>
            </div>
            <div className="summary-row total">
              <strong>Total</strong>
              <strong><FaCoins /> {total}</strong>
            </div>

            <div className="summary-actions">
              <button className="btn btn-secondary" onClick={() => clearCart()}>Clear Cart</button>
              <button className="btn btn-primary" onClick={handlePlaceOrder}>{`Place Order (${total} coins)`}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
