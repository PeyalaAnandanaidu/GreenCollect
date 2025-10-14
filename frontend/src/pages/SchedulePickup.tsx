import { useEffect, useState } from 'react';
import './SchedulePickup.css';
import { FaCalendar, FaTrash, FaMapMarkerAlt, FaCheckCircle, FaTimes, FaCoins, FaSpinner } from 'react-icons/fa';

interface SchedulePickupProps {
  onClose: () => void;
  userId?: string; // Add userId prop
}

const SchedulePickup: React.FC<SchedulePickupProps> = ({ onClose, userId }) => {
  const [formData, setFormData] = useState({
    pickupDate: '',
    wasteType: '',
    weight: '',
    address: '',
    specialInstructions: '',
    contactNumber: ''
  });
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(t);
  }, []);

  const wasteTypes = [
    { value: 'plastic', label: 'Plastic', color: '#ff9800' },
    { value: 'paper', label: 'Paper', color: '#ffb74d' },
    { value: 'electronics', label: 'Electronics', color: '#ffa726' },
    { value: 'metal', label: 'Metal', color: '#ff9800' },
    { value: 'glass', label: 'Glass', color: '#ffb74d' },
    { value: 'organic', label: 'Organic', color: '#ffa726' }
  ];

  const weightOptions = [
    { value: '1-2', label: '1-2 kg', coins: 15, numericWeight: 1.5 },
    { value: '3-5', label: '3-5 kg', coins: 35, numericWeight: 4 },
    { value: '5-10', label: '5-10 kg', coins: 65, numericWeight: 7.5 },
    { value: '10-20', label: '10-20 kg', coins: 120, numericWeight: 15 },
    { value: '20+', label: '20+ kg', coins: 250, numericWeight: 25 }
  ];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userId) {
      setError('Please log in to schedule a pickup');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Get numeric weight from selected option
      const weightOption = weightOptions.find(option => option.value === formData.weight);
      const estimatedWeight = weightOption ? weightOption.numericWeight : 0;

      // Prepare data for backend
      const pickupDateTime = new Date(formData.pickupDate);
      const requestData = {
        userId: userId,
        pickupDate: pickupDateTime.toISOString().split('T')[0], // YYYY-MM-DD
        pickupTime: pickupDateTime.toTimeString().split(' ')[0], // HH:MM:SS
        wasteType: formData.wasteType,
        estimatedWeight: estimatedWeight,
        pickupAddress: formData.address,
        contactNumber: formData.contactNumber || 'Not provided',
        instructions: formData.specialInstructions || 'None'
      };

      console.log('Submitting pickup request:', requestData);

      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      
      const response = await fetch('https://greencollect.onrender.com/api/waste-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(requestData)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to schedule pickup');
      }

      console.log('Pickup scheduled successfully:', result);
      
      // Show success message
      alert('✅ Pickup scheduled successfully! Our collector will contact you soon.');
      
      // Close the modal
      onClose();

    } catch (err: any) {
      console.error('Error scheduling pickup:', err);
      setError(err.message || 'Failed to schedule pickup. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = formData.pickupDate && formData.wasteType && formData.weight && formData.address;

  const getEstimatedCoins = () => {
    if (!formData.weight) return 0;
    const weightOption = weightOptions.find(option => option.value === formData.weight);
    return weightOption ? weightOption.coins : 0;
  };

  return (
    <div className="schedule-pickup-overlay">
      <div className="schedule-pickup-modal">
        <div className={`schedule-pickup-header ${mounted ? 'animate-in' : ''}`}>
          <div className="header-content">
            <FaCalendar className="header-icon" />
            <div>
              <h2>Schedule Waste Pickup</h2>
              <p>Fill in the details to schedule your collection</p>
            </div>
          </div>
          <button className="close-btn" onClick={onClose} disabled={loading}>
            <FaTimes />
          </button>
        </div>

        <div className="schedule-pickup-content">
          {error && (
            <div className="error-banner">
              <FaTimes />
              <span>{error}</span>
              <button onClick={() => setError('')}>×</button>
            </div>
          )}

          <form onSubmit={handleSubmit} className={`schedule-pickup-form ${mounted ? 'animate-in delay-1' : ''}`}>
            {/* Pickup Date */}
            <div className="form-group">
              <label htmlFor="pickupDate">
                <FaCalendar className="input-icon" />
                Pickup Date & Time
              </label>
              <input
                type="datetime-local"
                id="pickupDate"
                name="pickupDate"
                value={formData.pickupDate}
                onChange={handleChange}
                required
                min={new Date().toISOString().slice(0, 16)}
                disabled={loading}
              />
            </div>

            {/* Waste Type Dropdown */}
            <div className="form-group">
              <label htmlFor="wasteType">
                <FaTrash className="input-icon" />
                Waste Type
              </label>
              <select
                id="wasteType"
                name="wasteType"
                value={formData.wasteType}
                onChange={handleChange}
                required
                disabled={loading}
              >
                <option value="">Select waste type</option>
                {wasteTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Weight Selection */}
            <div className="form-group">
              <label htmlFor="weight">
                <FaTrash className="input-icon" />
                Estimated Weight
              </label>
              <select
                id="weight"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                required
                disabled={loading}
              >
                <option value="">Select weight range</option>
                {weightOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label} (+{option.coins} coins)
                  </option>
                ))}
              </select>
            </div>

            {/* Address */}
            <div className="form-group">
              <label htmlFor="address">
                <FaMapMarkerAlt className="input-icon" />
                Pickup Address
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter your complete address"
                required
                disabled={loading}
              />
            </div>

            {/* Contact Number */}
            <div className="form-group">
              <label htmlFor="contactNumber">Contact Number</label>
              <input
                type="tel"
                id="contactNumber"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleChange}
                placeholder="Enter your contact number"
                disabled={loading}
              />
            </div>

            {/* Special Instructions */}
            <div className="form-group">
              <label htmlFor="specialInstructions">Special Instructions (Optional)</label>
              <textarea
                id="specialInstructions"
                name="specialInstructions"
                value={formData.specialInstructions}
                onChange={handleChange}
                placeholder="Any special instructions for the collector..."
                rows={3}
                disabled={loading}
              />
            </div>

            {/* Form Actions */}
            <div className="form-actions">
              <button 
                type="button" 
                className="cancel-btn" 
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="submit-btn"
                disabled={!isFormValid || loading}
              >
                {loading ? (
                  <>
                    <FaSpinner className="btn-icon spinning" />
                    Scheduling...
                  </>
                ) : (
                  <>
                    <FaCheckCircle className="btn-icon" />
                    Schedule Pickup
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Estimated Rewards Info */}
          <div className={`rewards-info ${mounted ? 'animate-in delay-2' : ''}`}>
            <div className="rewards-card">
              <div className="rewards-header">
                <FaCoins className="rewards-icon" />
                <h4>Estimated Rewards</h4>
              </div>
              <div className="rewards-details">
                <div className="reward-item">
                  <span className="reward-type">
                    {formData.wasteType ? 
                      wasteTypes.find(w => w.value === formData.wasteType)?.label : 'Select waste type'
                    }
                  </span>
                  <span className="reward-coins">
                    {formData.weight ? `+${getEstimatedCoins()} coins` : 'Select weight'}
                  </span>
                </div>
                <div className="reward-total">
                  <strong>Total Estimated:</strong>
                  <strong className="total-coins">
                    {getEstimatedCoins()} coins
                  </strong>
                </div>
              </div>
              <div className="rewards-note">
                <p>🎉 You'll earn eco-coins that can be redeemed for sustainable products!</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchedulePickup;