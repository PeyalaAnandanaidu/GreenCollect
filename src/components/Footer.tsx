import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer bg-dark text-white pt-5">
      <div className="container">
        <div className="row">

          {/* About Section */}
          <div className="col-md-3 mb-4">
            <h5 className="fw-bold mb-3">About GreenCollect</h5>
            <p>
              GreenCollect is a smart waste collection & rewards platform connecting households,
              collectors, and recycling centers. Contribute to a cleaner planet while earning rewards.
            </p>
          </div>

          {/* Services Section */}
          <div className="col-md-3 mb-4">
            <h5 className="fw-bold mb-3">Services</h5>
            <ul className="list-unstyled">
              <li><Link to="#" className="footer-link">Waste Pickup</Link></li>
              <li><Link to="#" className="footer-link">Rewards System</Link></li>
              <li><Link to="#" className="footer-link">Real-time Tracking</Link></li>
              <li><Link to="#" className="footer-link">Eco Initiatives</Link></li>
            </ul>
          </div>

          {/* Contact Section */}
          <div className="col-md-3 mb-4">
            <h5 className="fw-bold mb-3">Contact Us</h5>
            <p>Email: support@greencollect.com</p>
            <p>Phone: +91 123 456 7890</p>
            <p>Address: RGUKT RK Valley, Andhra Pradesh</p>
          </div>

          {/* Social Media */}
          <div className="col-md-3 mb-4">
            <h5 className="fw-bold mb-3">Follow Us</h5>
            <div className="d-flex gap-3">
              <a href="#" className="footer-social"><FaFacebook /></a>
              <a href="#" className="footer-social"><FaTwitter /></a>
              <a href="#" className="footer-social"><FaInstagram /></a>
              <a href="#" className="footer-social"><FaLinkedin /></a>
            </div>
          </div>

        </div>

        <hr className="bg-secondary" />

        <div className="text-center py-3">
          &copy; 2025 GreenCollect. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
