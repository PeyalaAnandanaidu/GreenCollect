import './Home.css';
import { FaRecycle, FaLeaf, FaTruck, FaCoins, FaHandsHelping, FaCheckCircle, FaArrowRight } from 'react-icons/fa';
import { Typewriter } from 'react-simple-typewriter';

const Home = () => {
    return (
        <div className="home-container">
            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-background">
                    <div className="floating-shapes">
                        <div className="shape shape-1"></div>
                        <div className="shape shape-2"></div>
                        <div className="shape shape-3"></div>
                    </div>
                </div>
                
                <div className="hero-content">
                    <div className="hero-icon-container">
                        <FaRecycle className="hero-icon" />
                    </div>
                    <h1 className="hero-title">GreenCollect</h1>
                    <h2 className="hero-subtitle">
                        <Typewriter
                            words={['Track your waste', 'Earn rewards', 'Contribute to a cleaner planet']}
                            loop={0}
                            cursor
                            cursorStyle="|"
                            typeSpeed={70}
                            deleteSpeed={50}
                            delaySpeed={1500}
                        />
                    </h2>
                    <div className="hero-actions">
                        <a href="/register" className="hero-cta primary">
                            Get Started <FaArrowRight />
                        </a>
                        <a href="/about" className="hero-cta secondary">
                            Learn More
                        </a>
                    </div>
                </div>
            </section>

            {/* Services Section */}
            <section className="section services-section">
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title">Our Services</h2>
                        <p className="section-subtitle">Comprehensive waste management solutions for a sustainable future</p>
                    </div>
                    <div className="services-grid">
                        <div className="service-card">
                            <div className="service-icon-container">
                                <FaTruck className="service-icon" />
                            </div>
                            <h3 className="service-title">Waste Pickup</h3>
                            <p className="service-description">Schedule convenient pickups for e-waste, plastics, and paper.</p>
                        </div>
                        
                        <div className="service-card">
                            <div className="service-icon-container">
                                <FaCoins className="service-icon" />
                            </div>
                            <h3 className="service-title">Rewards System</h3>
                            <p className="service-description">Earn eco-coins for every contribution and redeem them.</p>
                        </div>
                        
                        <div className="service-card">
                            <div className="service-icon-container">
                                <FaRecycle className="service-icon" />
                            </div>
                            <h3 className="service-title">Real-time Tracking</h3>
                            <p className="service-description">Monitor your waste in real-time and check progress.</p>
                        </div>
                        
                        <div className="service-card">
                            <div className="service-icon-container">
                                <FaLeaf className="service-icon" />
                            </div>
                            <h3 className="service-title">Eco Initiatives</h3>
                            <p className="service-description">Participate in green projects and support sustainability.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="section process-section">
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title">How It Works</h2>
                        <p className="section-subtitle">Simple steps to make a big impact on our planet</p>
                    </div>
                    <div className="process-steps">
                        <div className="process-step">
                            <div className="step-number">01</div>
                            <div className="step-icon">
                                <FaHandsHelping />
                            </div>
                            <h3 className="step-title">Request Pickup</h3>
                            <p className="step-description">Book pickups for waste with just a few clicks.</p>
                        </div>
                        
                        <div className="process-step">
                            <div className="step-number">02</div>
                            <div className="step-icon">
                                <FaCheckCircle />
                            </div>
                            <h3 className="step-title">Collector Pickup</h3>
                            <p className="step-description">Collectors pick up and deliver to recycling centers.</p>
                        </div>
                        
                        <div className="process-step">
                            <div className="step-number">03</div>
                            <div className="step-icon">
                                <FaCoins />
                            </div>
                            <h3 className="step-title">Earn Coins</h3>
                            <p className="step-description">Earn eco-coins for every waste submission.</p>
                        </div>
                        
                        <div className="process-step">
                            <div className="step-number">04</div>
                            <div className="step-icon">
                                <FaLeaf />
                            </div>
                            <h3 className="step-title">Support Sustainability</h3>
                            <p className="step-description">Help reduce waste and promote a greener planet.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Rewards Section */}
            <section className="section rewards-section">
                <div className="container">
                    <div className="rewards-content">
                        <div className="rewards-text">
                            <h2 className="section-title">Rewards & Gamification</h2>
                            <p className="section-subtitle">
                                Users earn coins for each waste submission. Redeem coins for eco-friendly products or donate them for green initiatives.
                            </p>
                            <div className="rewards-stats">
                                <div className="stat">
                                    <div className="stat-number">10,000+</div>
                                    <div className="stat-label">Coins Redeemed</div>
                                </div>
                                <div className="stat">
                                    <div className="stat-number">500+</div>
                                    <div className="stat-label">Active Users</div>
                                </div>
                                <div className="stat">
                                    <div className="stat-number">2,000+</div>
                                    <div className="stat-label">Kg Waste Collected</div>
                                </div>
                            </div>
                        </div>
                        <div className="rewards-cards">
                            <div className="reward-card">
                                <div className="reward-icon">
                                    <FaCoins />
                                </div>
                                <h3 className="reward-title">Collect Coins</h3>
                                <p className="reward-description">Track your eco-contributions and accumulate coins.</p>
                            </div>
                            <div className="reward-card">
                                <div className="reward-icon">
                                    <FaLeaf />
                                </div>
                                <h3 className="reward-title">Redeem Rewards</h3>
                                <p className="reward-description">Use coins for eco-products or donate to green causes.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Partner Recycling Centers */}
            <section className="section partners-section">
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title">Our Partner Recycling Centers</h2>
                        <p className="section-subtitle">We collaborate with verified recycling centers to ensure your waste is processed responsibly.</p>
                    </div>
                    <div className="partners-grid">
                        <div className="partner-card">
                            <div className="partner-logo">RC</div>
                            <h3 className="partner-name">Recycle Center A</h3>
                            <p className="partner-specialty">Electronic waste and plastics</p>
                            <div className="partner-badges">
                                <span className="badge">Certified</span>
                                <span className="badge">E-waste</span>
                            </div>
                        </div>
                        <div className="partner-card">
                            <div className="partner-logo">GC</div>
                            <h3 className="partner-name">GreenCycle Center</h3>
                            <p className="partner-specialty">Paper and Cardboard</p>
                            <div className="partner-badges">
                                <span className="badge">Certified</span>
                                <span className="badge">Paper</span>
                            </div>
                        </div>
                        <div className="partner-card">
                            <div className="partner-logo">EC</div>
                            <h3 className="partner-name">Eco Processors</h3>
                            <p className="partner-specialty">Organic & Food Waste</p>
                            <div className="partner-badges">
                                <span className="badge">Certified</span>
                                <span className="badge">Organic</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="section testimonials-section">
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title">What People Say</h2>
                        <p className="section-subtitle">Join thousands of satisfied users making a difference</p>
                    </div>
                    <div className="testimonials-grid">
                        <div className="testimonial-card">
                            <div className="testimonial-content">
                                <p className="testimonial-text">"GreenCollect made recycling easy and rewarding! I've earned enough coins to get sustainable products."</p>
                            </div>
                            <div className="testimonial-author">
                                <div className="author-avatar">JD</div>
                                <div className="author-info">
                                    <div className="author-name">John D.</div>
                                    <div className="author-role">Eco Enthusiast</div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="testimonial-card">
                            <div className="testimonial-content">
                                <p className="testimonial-text">"Our community reduced plastic waste by 40% thanks to this platform. The reward system keeps everyone motivated!"</p>
                            </div>
                            <div className="testimonial-author">
                                <div className="author-avatar">SK</div>
                                <div className="author-info">
                                    <div className="author-name">Sarah K.</div>
                                    <div className="author-role">Community Leader</div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="testimonial-card">
                            <div className="testimonial-content">
                                <p className="testimonial-text">"Tracking e-waste is simple and transparent. I love knowing exactly where my electronic waste ends up."</p>
                            </div>
                            <div className="testimonial-author">
                                <div className="author-avatar">ML</div>
                                <div className="author-info">
                                    <div className="author-name">Michael L.</div>
                                    <div className="author-role">Tech Professional</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="section cta-section">
                <div className="container">
                    <div className="cta-content">
                        <h2 className="cta-title">Ready to Make a Difference?</h2>
                        <p className="cta-subtitle">Join thousands of users already contributing to a cleaner planet while earning rewards.</p>
                        <div className="cta-actions">
                            <a href="/register" className="cta-button primary">
                                Start Recycling Now <FaArrowRight />
                            </a>
                            <a href="/login" className="cta-button secondary">
                                Sign In
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;