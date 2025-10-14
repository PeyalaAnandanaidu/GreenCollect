import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './RedeemCheckout.css';
import { FaCoins, FaMapMarkerAlt, FaTruck, FaClipboardCheck, FaChevronLeft } from 'react-icons/fa';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  image: string;
}

type Step = 1 | 2 | 3;

const RedeemCheckout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const product = (location.state as { product?: Product })?.product;

  const [step, setStep] = useState<Step>(1);
  const [placing, setPlacing] = useState(false);
  const [success, setSuccess] = useState<{ orderId: string } | null>(null);

  const [address, setAddress] = useState({
    fullName: '',
    phone: '',
    email: '',
  label: 'Home' as 'Home' | 'Work' | 'Other',
    line1: '',
    line2: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India',
    notes: ''
  });

  const [delivery, setDelivery] = useState({
    speed: 'standard' as 'standard' | 'express',
    slot: 'Anytime',
  });

  type Address = typeof address;
  const [savedAddresses, setSavedAddresses] = useState<(Address & { isDefault?: boolean })[]>([]);
  const [selectedAddrIdx, setSelectedAddrIdx] = useState<number | 'new'>(-1);
  const [saveAddress, setSaveAddress] = useState(true);
  const [editingIdx, setEditingIdx] = useState<number | null>(null);

  useEffect(() => {
    // Prefill from localStorage profile if present
    try {
      const saved = localStorage.getItem('profile.details');
      if (saved) {
        const { name, email } = JSON.parse(saved);
        setAddress((a) => ({ ...a, fullName: name || a.fullName, email: email || a.email }));
      }
      const addrRaw = localStorage.getItem('redeem.addresses');
      if (addrRaw) {
        const parsed = JSON.parse(addrRaw) as (Partial<Address> & { isDefault?: boolean })[];
        const list = parsed.map((a) => ({
          ...a,
          label: (a as any).label || 'Home',
        })) as (Address & { isDefault?: boolean })[];
        setSavedAddresses(list);
        if (list.length > 0) {
          const defIdx = list.findIndex(a => a.isDefault);
          setSelectedAddrIdx(defIdx >= 0 ? defIdx : 0);
        } else {
          setSelectedAddrIdx('new');
        }
      } else {
        setSelectedAddrIdx('new');
      }
    } catch {}
  }, []);

  const canContinueStep1 = useMemo(() => {
    const { fullName, phone, line1, city, state, pincode } = address;
    return (
      fullName.trim().length >= 2 &&
      /^\+?\d{10,15}$/.test(phone.replace(/\s|-/g, '')) &&
      line1.trim().length >= 3 &&
      city.trim().length >= 2 &&
      state.trim().length >= 2 &&
      /^\d{5,6}$/.test(pincode)
    );
  }, [address]);

  const canProceedAddress = selectedAddrIdx === 'new' ? canContinueStep1 : (selectedAddrIdx as number) >= 0 && savedAddresses[(selectedAddrIdx as number)] != null;

  if (!product) {
    return (
      <div className="redeem-page">
        <div className="redeem-container">
          <div className="empty-card animate-in">
            <h2>No product selected</h2>
            <p>Please choose a product from the Eco Store to redeem.</p>
            <button className="btn btn-yellow" onClick={() => navigate('/dashboard')}>Back to Store</button>
          </div>
        </div>
      </div>
    );
  }

  const placeOrder = async () => {
    setPlacing(true);
    // Simulate API
    await new Promise((r) => setTimeout(r, 900));
    const orderId = `JG-ORD-${Date.now().toString().slice(-8)}`;
    try {
      const prev = JSON.parse(localStorage.getItem('redeem.orders') || '[]');
      prev.push({ orderId, product, address, delivery, createdAt: new Date().toISOString() });
      localStorage.setItem('redeem.orders', JSON.stringify(prev));
    } catch {}
  setSuccess({ orderId });
  setPlacing(false);
  navigate('/order-success', { state: { orderId, product, totalCoins: product.price + (delivery.speed === 'express' ? 25 : 0) } });
  };

  return (
    <div className="redeem-page">
      <div className="redeem-container">
        <div className="header-row animate-in">
          <button className="back-btn" onClick={() => navigate(-1)}>
            <FaChevronLeft /> Back
          </button>
          <h1 className="title">Redeem Checkout</h1>
        </div>

  <div className={`content-grid animate-in delay-1 ${step === 1 ? 'single' : ''}`}>
          {/* Left: Steps */}
          <div className="left-col">
            {/* Stepper */}
            <div className="stepper animate-in delay-1">
              <div className={`step ${step >= 1 ? 'active' : ''}`}>
                <div className="step-icon"><FaMapMarkerAlt /></div>
                <div className="step-label">Delivery Address</div>
              </div>
              <div className={`step ${step >= 2 ? 'active' : ''}`}>
                <div className="step-icon"><FaTruck /></div>
                <div className="step-label">Delivery Options</div>
              </div>
              <div className={`step ${step >= 3 ? 'active' : ''}`}>
                <div className="step-icon"><FaClipboardCheck /></div>
                <div className="step-label">Review & Place</div>
              </div>
            </div>

            {step === 1 && (
              <div className="card card-address animate-in delay-2">
                <h2 className="card-title">Delivery Address</h2>

                {/* My Addresses */}
                <div className="addresses-block">
                  <div className="addresses-header">
                    <div className="addresses-title">My Addresses</div>
                    <button
                      type="button"
                      className="link-btn"
                      onClick={() => {
                        setSelectedAddrIdx('new');
                        setEditingIdx(null);
                        setAddress({
                          fullName: '', phone: '', email: '', label: 'Home', line1: '', line2: '', city: '', state: '', pincode: '', country: 'India', notes: ''
                        });
                      }}
                    >
                      + Add New Location
                    </button>
                  </div>
                  {savedAddresses.length === 0 ? (
                    <div className="addresses-empty">No saved addresses yet.</div>
                  ) : (
                    <div className="addresses-list">
                      {savedAddresses.map((addr, idx) => (
                        <label key={idx} className={`address-item ${selectedAddrIdx === idx ? 'selected' : ''}`}>
                          <input
                            type="radio"
                            name="savedAddress"
                            checked={selectedAddrIdx === idx}
                            onChange={() => {
                              setSelectedAddrIdx(idx);
                              setAddress(addr);
                            }}
                          />
                          <div className="address-lines">
                            <div className="address-line-strong">
                              {addr.fullName} • {addr.phone}
                              {addr.isDefault && <span className="addr-badge">Default</span>}
                              {addr.label && <span className="addr-badge badge-soft">{addr.label}</span>}
                            </div>
                            <div className="address-line">{addr.line1}{addr.line2 ? `, ${addr.line2}` : ''}</div>
                            <div className="address-line">{addr.city}, {addr.state} {addr.pincode}, {addr.country}</div>
                            <div className="addr-actions">
                              {!addr.isDefault && (
                                <button
                                  type="button"
                                  className="addr-action"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    const next = savedAddresses.map((a, i) => ({ ...a, isDefault: i === idx }));
                                    setSavedAddresses(next);
                                    try { localStorage.setItem('redeem.addresses', JSON.stringify(next)); } catch {}
                                  }}
                                >
                                  Make default
                                </button>
                              )}
                              <button
                                type="button"
                                className="addr-action"
                                onClick={(e) => {
                                  e.preventDefault();
                                  // Edit flow: open form prefilled
                                  setEditingIdx(idx);
                                  setSelectedAddrIdx('new');
                                  setAddress({ ...addr });
                                }}
                              >
                                Edit
                              </button>
                              <button
                                type="button"
                                className="addr-action danger"
                                onClick={(e) => {
                                  e.preventDefault();
                                  const next = savedAddresses.filter((_, i) => i !== idx);
                                  setSavedAddresses(next);
                                  try { localStorage.setItem('redeem.addresses', JSON.stringify(next)); } catch {}
                                  if (selectedAddrIdx === idx) setSelectedAddrIdx(next.length ? 0 : 'new');
                                }}
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
                <div className="form-grid" style={{ display: selectedAddrIdx === 'new' ? 'grid' as const : 'none' }}>
                  <div className="two-col">
                    <div className="form-row">
                      <label>Full Name</label>
                      <input value={address.fullName} onChange={(e) => setAddress({ ...address, fullName: e.target.value })} />
                    </div>
                  </div>
                  <div className="two-col">
                    <div className="form-row">
                      <label>Phone</label>
                      <input placeholder="10-15 digits" value={address.phone} onChange={(e) => setAddress({ ...address, phone: e.target.value })} />
                    </div>
                  </div>
                  <div className="two-col">
                    <div className="form-row">
                      <label>Address Type</label>
                      <div className="addr-type-pills">
                        {(['Home','Work','Other'] as const).map(t => (
                          <button
                            key={t}
                            type="button"
                            className={`pill-btn ${address.label === t ? 'active' : ''}`}
                            onClick={() => setAddress({ ...address, label: t })}
                          >{t}</button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="two-col">
                    <div className="form-row">
                      <label>Email (optional)</label>
                      <input type="email" value={address.email} onChange={(e) => setAddress({ ...address, email: e.target.value })} />
                    </div>
                  </div>
                  <div className="two-col">
                    <div className="form-row">
                      <label>Country</label>
                      <input value={address.country} onChange={(e) => setAddress({ ...address, country: e.target.value })} />
                    </div>
                  </div>
                  <div className="two-col">
                    <div className="form-row">
                      <label>Address Line 1</label>
                      <input value={address.line1} onChange={(e) => setAddress({ ...address, line1: e.target.value })} />
                    </div>
                  </div>
                  <div className="two-col">
                    <div className="form-row">
                      <label>Address Line 2 (optional)</label>
                      <input value={address.line2} onChange={(e) => setAddress({ ...address, line2: e.target.value })} />
                    </div>
                  </div>
                  <div className="two-col">
                    <div className="form-row">
                      <label>City</label>
                      <input value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} />
                    </div>
                  </div>
                  <div className="two-col">
                    <div className="form-row">
                      <label>State</label>
                      <input value={address.state} onChange={(e) => setAddress({ ...address, state: e.target.value })} />
                    </div>
                  </div>
                  <div className="two-col">
                    <div className="form-row">
                      <label>Pincode</label>
                      <input value={address.pincode} onChange={(e) => setAddress({ ...address, pincode: e.target.value })} />
                    </div>
                  </div>
                  <div className="two-col">
                    <div className="form-row">
                      <label>Additional Notes (optional)</label>
                      <textarea value={address.notes} onChange={(e) => setAddress({ ...address, notes: e.target.value })} />
                    </div>
                  </div>
                </div>
                {selectedAddrIdx === 'new' && (
                  <div className="save-address-row">
                    <label className="save-address">
                      <input type="checkbox" checked={saveAddress} onChange={(e) => setSaveAddress(e.target.checked)} />
                      <span>Save this address to My Addresses</span>
                    </label>
                  </div>
                )}
                <div className="actions">
                  <button className="btn btn-outline" onClick={() => navigate('/dashboard')}>Cancel</button>
                  <button
                    className="btn btn-yellow"
                    disabled={!canProceedAddress}
                    onClick={() => {
                      if (selectedAddrIdx === 'new') {
                        if (editingIdx != null) {
                          const next = savedAddresses.map((a, i) => i === editingIdx ? { ...address, isDefault: a.isDefault } : a);
                          setSavedAddresses(next);
                          try { localStorage.setItem('redeem.addresses', JSON.stringify(next)); } catch {}
                          setSelectedAddrIdx(editingIdx);
                          setEditingIdx(null);
                        } else if (saveAddress) {
                          const next = [...savedAddresses, address];
                          setSavedAddresses(next);
                          try { localStorage.setItem('redeem.addresses', JSON.stringify(next)); } catch {}
                          setSelectedAddrIdx(next.length - 1);
                        }
                      } else if (typeof selectedAddrIdx === 'number' && savedAddresses[selectedAddrIdx]) {
                        setAddress(savedAddresses[selectedAddrIdx]);
                      }
                      setStep(2);
                    }}
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}
            {step === 1 && (
              <div className="card product-details-below animate-in delay-3">
                <h2 className="card-title">Product Details</h2>
                <div className="below-product">
                  <img src={product.image} alt={product.name} />
                  <div className="bp-info">
                    <div className="bp-name" title={product.name}>{product.name}</div>
                    <div className="bp-category">{product.category}</div>
                    <div className="bp-price"><FaCoins /> {product.price}</div>
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="card animate-in delay-2">
                <h2 className="card-title">Delivery Options</h2>
                <div className="delivery-options">
                  <label className={`option ${delivery.speed === 'standard' ? 'selected' : ''}`}>
                    <input type="radio" name="speed" checked={delivery.speed === 'standard'} onChange={() => setDelivery({ ...delivery, speed: 'standard' })} />
                    <div>
                      <div className="option-title">Standard Delivery</div>
                      <div className="option-sub">3-5 days • Free</div>
                    </div>
                  </label>
                  <label className={`option ${delivery.speed === 'express' ? 'selected' : ''}`}>
                    <input type="radio" name="speed" checked={delivery.speed === 'express'} onChange={() => setDelivery({ ...delivery, speed: 'express' })} />
                    <div>
                      <div className="option-title">Express Delivery</div>
                      <div className="option-sub">1-2 days • 25 coins</div>
                    </div>
                  </label>
                </div>
                <div className="form-row">
                  <label>Preferred Time Slot</label>
                  <select value={delivery.slot} onChange={(e) => setDelivery({ ...delivery, slot: e.target.value })}>
                    <option>Anytime</option>
                    <option>9 AM - 12 PM</option>
                    <option>12 PM - 3 PM</option>
                    <option>3 PM - 6 PM</option>
                    <option>6 PM - 9 PM</option>
                  </select>
                </div>
                <div className="actions">
                  <button className="btn btn-outline" onClick={() => setStep(1)}>Back</button>
                  <button className="btn btn-yellow" onClick={() => setStep(3)}>Review</button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="card animate-in delay-2">
                <h2 className="card-title">Review & Place Order</h2>
                <div className="review-grid">
                  <div className="review-section">
                    <h3>Delivery Address</h3>
                    <p>
                      {address.fullName}<br/>
                      {address.line1}{address.line2 ? `, ${address.line2}` : ''}<br/>
                      {address.city}, {address.state} {address.pincode}<br/>
                      {address.country}<br/>
                      {address.phone}
                    </p>
                  </div>
                  <div className="review-section">
                    <h3>Delivery</h3>
                    <p>{delivery.speed === 'standard' ? 'Standard (Free)' : 'Express (25 coins)'} • {delivery.slot}</p>
                  </div>
                </div>
                <div className="actions">
                  <button className="btn btn-outline" onClick={() => setStep(2)}>Back</button>
                  <button className="btn btn-yellow" disabled={placing} onClick={placeOrder}>
                    {placing ? 'Placing…' : 'Place Order'}
                  </button>
                </div>
                {success && (
                  <div className="success-banner">
                    <div className="success-title">Order Placed!</div>
                    <div className="success-sub">Order ID: {success.orderId}</div>
                    <button className="btn btn-outline" onClick={() => navigate('/dashboard')}>Go to Dashboard</button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right: Order Summary (hidden on Step 1) */}
          {step !== 1 && (
            <aside className="right-col animate-in delay-3">
              <div className="summary-card">
                <div className="product-mini">
                  <img src={product.image} alt={product.name} />
                  <div className="mini-info">
                    <div className="mini-name" title={product.name}>{product.name}</div>
                    <div className="mini-category">{product.category}</div>
                  </div>
                </div>
                <div className="price-row">
                  <span>Item Price</span>
                  <span className="price"><FaCoins /> {product.price}</span>
                </div>
                <div className="price-row">
                  <span>Delivery</span>
                  <span>{delivery.speed === 'express' ? (<><FaCoins /> 25</>) : 'Free'}</span>
                </div>
                <div className="divider" />
                <div className="price-row total">
                  <span>Total</span>
                  <span className="price"><FaCoins /> {product.price + (delivery.speed === 'express' ? 25 : 0)}</span>
                </div>
              </div>
            </aside>
          )}
        </div>
      </div>
    </div>
  );
};

export default RedeemCheckout;
