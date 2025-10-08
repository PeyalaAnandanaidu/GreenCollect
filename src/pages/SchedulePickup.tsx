import { useState } from 'react';
import './SchedulePickup.css';
import { FaCalendar, FaTrash, FaMapMarkerAlt, FaCheckCircle } from 'react-icons/fa';

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
    { value: 'plastic', label: 'Plastic' },
    { value: 'paper', label: 'Paper' },
    { value: 'electronics', label: 'Electronics' },
  ];

  const weightOptions = [
    { value: '1-2', label: '1-2 kg' },
    { value: '3-5', label: '3-5 kg' },
    { value: '5-10', label: '5-10 kg' },
    { value: '10-20', label: '10-20 kg' },
    { value: '20+', label: '20+ kg' }
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
    alert('Pickup scheduled successfully!');
    onClose();
  };

  const isFormValid = formData.pickupDate && formData.wasteType && formData.weight && formData.address;

  return (
    <div className="schedule-pickup-overlay">
      <div className="schedule-pickup-modal">
        <div className="schedule-pickup-header">
          <h2>Schedule a Pickup</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

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
            <h4>Estimated Rewards</h4>
            <div className="rewards-details">
              <div className="reward-item">
                <span className="reward-type">
                  {formData.wasteType ? wasteTypes.find(w => w.value === formData.wasteType)?.label : 'Waste'}
                </span>
                <span className="reward-coins">
                  +{formData.weight ? 
                    (() => {
                      const weightMap: {[key: string]: number} = {
                        '1-2': 10, '3-5': 25, '5-10': 50, '10-20': 100, '20+': 200
                      };
                      return weightMap[formData.weight] || 0;
                    })() 
                    : 0} coins
                </span>
              </div>
              <div className="reward-total">
                <strong>
                  Total: {formData.wasteType && formData.weight ? 
                    (() => {
                      const weightMap: {[key: string]: number} = {
                        '1-2': 10, '3-5': 25, '5-10': 50, '10-20': 100, '20+': 200
                      };
                      return weightMap[formData.weight] || 0;
                    })() 
                    : 0} coins
                </strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchedulePickup;
