import { useState } from 'react';
import './SchedulePickup.css';
import { FaCalendar, FaTrash, FaMapMarkerAlt, FaCheckCircle, FaTimes, FaCoins } from 'react-icons/fa';

interface SchedulePickupProps {
  onClose: () => void;
}

const SchedulePickup: React.FC<SchedulePickupProps> = ({ onClose }) => {
  const [formData, setFormData] = useState({
    pickupDate: '',
    wasteType: '',
    weight: '',
    address: '',
    specialInstructions: '',
    contactNumber: ''
  });

  const wasteTypes = [
    { value: 'plastic', label: 'Plastic', color: '#ff9800' },
    { value: 'paper', label: 'Paper', color: '#ffb74d' },
    { value: 'electronics', label: 'Electronics', color: '#ffa726' },
    { value: 'metal', label: 'Metal', color: '#ff9800' },
    { value: 'glass', label: 'Glass', color: '#ffb74d' },
    { value: 'organic', label: 'Organic', color: '#ffa726' }
  ];

  const weightOptions = [
    { value: '1-2', label: '1-2 kg', coins: 15 },
    { value: '3-5', label: '3-5 kg', coins: 35 },
    { value: '5-10', label: '5-10 kg', coins: 65 },
    { value: '10-20', label: '10-20 kg', coins: 120 },
    { value: '20+', label: '20+ kg', coins: 250 }
  ];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Pickup scheduled:', formData);
    alert('Pickup scheduled successfully! Our collector will contact you soon.');
    onClose();
  };

  const isFormValid = formData.pickupDate && formData.wasteType && formData.weight && formData.address;

  const getEstimatedCoins = () => {
    if (!formData.weight) return 0;
    const weightOption = weightOptions.find(option => option.value === formData.weight);
    return weightOption ? weightOption.coins : 0;
  };

  const getWasteTypeColor = () => {
    const wasteType = wasteTypes.find(type => type.value === formData.wasteType);
    return wasteType ? wasteType.color : '#ff9800';
  };

  return (
    <div className="schedule-pickup-overlay">
      <div className="schedule-pickup-modal">
        <div className="schedule-pickup-header">
          <div className="header-content">
            <FaCalendar className="header-icon" />
            <div>
              <h2>Schedule Waste Pickup</h2>
              <p>Fill in the details to schedule your collection</p>
            </div>
          </div>
          <button className="close-btn" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <div className="schedule-pickup-content">
          <form onSubmit={handleSubmit} className="schedule-pickup-form">
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
              >
                <option value="">Select weight range</option>
                {weightOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
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
              />
            </div>

            {/* Form Actions */}
            <div className="form-actions">
              <button type="button" className="cancel-btn" onClick={onClose}>
                Cancel
              </button>
              <button 
                type="submit" 
                className="submit-btn"
                disabled={!isFormValid}
              >
                <FaCheckCircle className="btn-icon" />
                Schedule Pickup
              </button>
            </div>
          </form>

          {/* Estimated Rewards Info */}
          <div className="rewards-info">
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