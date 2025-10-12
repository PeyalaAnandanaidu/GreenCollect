import './Home.css';
import { FaRecycle, FaLeaf, FaTruck, FaCoins, FaHandsHelping, FaCheckCircle, FaArrowRight, FaUsers, FaChartLine, FaMobileAlt, FaShieldAlt } from 'react-icons/fa';
import { Typewriter } from 'react-simple-typewriter';
import { useEffect, useRef, useState } from 'react';

const Home = () => {
    const [isVisible, setIsVisible] = useState(false);
    const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        setIsVisible(true);
        
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('slide-in');
                    }
                });
            },
            { threshold: 0.1 }
        );

        sectionRefs.current.forEach((ref) => {
            if (ref) observer.observe(ref);
        });

        return () => observer.disconnect();
    }, []);

    const addToRefs = (el: HTMLDivElement | null) => {
        if (el && !sectionRefs.current.includes(el)) {
            sectionRefs.current.push(el);
        }
    };

    return (
        <div className="home-container">
            {/* Hero Section */}
            <section className={`hero-section ${isVisible ? 'visible' : ''}`}>
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
                    <h1 className="hero-title">జనతాGarage</h1>
                    <h2 className="hero-subtitle">
                        <Typewriter
                            words={[ 'ఇచట ప్రకృతి కాపాడబడును']}
                            loop={0}
                            cursor
                            cursorStyle="|"
                            typeSpeed={70}
                            deleteSpeed={50}
                            delaySpeed={1500}
                        />
                    </h2>
                    <p className="hero-description">
                        Transform your e-waste, plastic, paper, and cardboard into rewards while contributing to a cleaner planet. 
                        Book pickups, track progress, and earn coins for sustainable products.
                    </p>
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

            {/* Problem & Solution Section */}
            <section ref={addToRefs} className="section problem-section">
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title">The Recycling Challenge</h2>
                        <p className="section-subtitle">Traditional waste management systems are inefficient and lack incentives</p>
                    </div>
                    <div className="problem-solution-grid">
                        <div className="problem-card">
                            <div className="problem-icon">
                                <FaLeaf />
                            </div>
                            <h3>The Problem</h3>
                            <ul>
                                <li>Inefficient e-waste and plastic recycling systems</li>
                                <li>Lack of proper disposal channels for households</li>
                                <li>No incentives for eco-friendly behavior</li>
                                <li>Environmental damage from improper waste disposal</li>
                            </ul>
                        </div>
                        <div className="solution-card">
                            <div className="solution-icon">
                                <FaRecycle />
                            </div>
                            <h3>Our Solution</h3>
                            <ul>
                                <li>Smart platform connecting users with collectors</li>
                                <li>Real-time tracking and transparent process</li>
                                <li>Reward system with redeemable eco-coins</li>
                                <li>Dedicated dashboards for all stakeholders</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Services Section */}
            <section ref={addToRefs} className="section services-section">
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title">How GreenCollect Works</h2>
                        <p className="section-subtitle">Simple steps to turn your waste into rewards</p>
                    </div>
                    <div className="services-grid">
                        <div className="service-card">
                            <div className="service-icon-container">
                                <FaMobileAlt className="service-icon" />
                            </div>
                            <h3 className="service-title">Book Pickup</h3>
                            <p className="service-description">Schedule waste collection for e-waste, plastics, paper, and cardboard with few clicks.</p>
                        </div>
                        
                        <div className="service-card">
                            <div className="service-icon-container">
                                <FaTruck className="service-icon" />
                            </div>
                            <h3 className="service-title">Collector Pickup</h3>
                            <p className="service-description">Verified collectors pick up your waste and deliver to recycling centers.</p>
                        </div>
                        
                        <div className="service-card">
                            <div className="service-icon-container">
                                <FaChartLine className="service-icon" />
                            </div>
                            <h3 className="service-title">Real-Time Tracking</h3>
                            <p className="service-description">Monitor your waste journey from pickup to recycling center in real-time.</p>
                        </div>
                        
                        <div className="service-card">
                            <div className="service-icon-container">
                                <FaCoins className="service-icon" />
                            </div>
                            <h3 className="service-title">Earn & Redeem</h3>
                            <p className="service-description">Get reward coins for contributions and redeem for sustainable products.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* User Types Section */}
            <section ref={addToRefs} className="section users-section">
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title">For Everyone in the Ecosystem</h2>
                        <p className="section-subtitle">Dedicated platforms for all stakeholders</p>
                    </div>
                    <div className="users-grid">
                        <div className="user-card">
                            <div className="user-icon">
                                <FaUsers />
                            </div>
                            <h3>Household Users</h3>
                            <p>Book pickups, track waste, earn coins, and redeem rewards for eco-friendly products.</p>
                            <ul>
                                <li>Easy waste pickup scheduling</li>
                                <li>Real-time tracking dashboard</li>
                                <li>Reward coins system</li>
                                <li>Contribution history</li>
                            </ul>
                        </div>
                        
                        <div className="user-card">
                            <div className="user-icon">
                                <FaTruck />
                            </div>
                            <h3>Collectors</h3>
                            <p>Manage collection requests, submit waste to centers, and track your earnings.</p>
                            <ul>
                                <li>Request management system</li>
                                <li>Route optimization</li>
                                <li>Earnings tracking</li>
                                <li>Performance analytics</li>
                            </ul>
                        </div>
                        
                        <div className="user-card">
                            <div className="user-icon">
                                <FaShieldAlt />
                            </div>
                            <h3>Recycling Centers</h3>
                            <p>Partner with us to receive verified waste streams and contribute to sustainability.</p>
                            <ul>
                                <li>Verified waste sources</li>
                                <li>Quality assurance</li>
                                <li>Partnership benefits</li>
                                <li>Impact reporting</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Rewards Section */}
            <section ref={addToRefs} className="section rewards-section">
                <div className="container">
                    <div className="rewards-content">
                        <div className="rewards-text">
                            <h2 className="section-title">Rewards & Gamification</h2>
                            <p className="section-subtitle">
                                Turn your eco-friendly actions into tangible rewards. Earn coins for every waste submission and redeem them for sustainable products or donate to green initiatives.
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
                                <p className="reward-description">Earn eco-coins for every successful waste submission and track your environmental impact.</p>
                            </div>
                            <div className="reward-card">
                                <div className="reward-icon">
                                    <FaLeaf />
                                </div>
                                <h3 className="reward-title">Redeem Rewards</h3>
                                <p className="reward-description">Use your coins to get sustainable products or donate to environmental causes.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Dashboard Preview Section */}
            <section ref={addToRefs} className="section dashboard-section">
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title">Smart Dashboard Experience</h2>
                        <p className="section-subtitle">Tailored interfaces for users, collectors, and administrators</p>
                    </div>
                    <div className="dashboard-grid">
                        <div className="dashboard-card">
                            <div className="dashboard-header">
                                <FaUsers className="dashboard-icon" />
                                <h3>User Dashboard</h3>
                            </div>
                            <ul>
                                <li>Book waste pickups</li>
                                <li>Real-time tracking</li>
                                <li>Coin balance & history</li>
                                <li>Rewards marketplace</li>
                                <li>Environmental impact</li>
                            </ul>
                        </div>
                        
                        <div className="dashboard-card">
                            <div className="dashboard-header">
                                <FaTruck className="dashboard-icon" />
                                <h3>Collector Dashboard</h3>
                            </div>
                            <ul>
                                <li>Manage pickup requests</li>
                                <li>Route optimization</li>
                                <li>Earnings tracking</li>
                                <li>Performance metrics</li>
                                <li>Center submissions</li>
                            </ul>
                        </div>
                        
                        <div className="dashboard-card">
                            <div className="dashboard-header">
                                <FaChartLine className="dashboard-icon" />
                                <h3>Admin Dashboard</h3>
                            </div>
                            <ul>
                                <li>Platform oversight</li>
                                <li>User management</li>
                                <li>Analytics & reports</li>
                                <li>System monitoring</li>
                                <li>Partner management</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section ref={addToRefs} className="section cta-section">
                <div className="container">
                    <div className="cta-content">
                        <h2 className="cta-title">Ready to Make a Difference?</h2>
                        <p className="cta-subtitle">
                            Join thousands of users already contributing to a cleaner planet while earning rewards for their eco-friendly actions.
                        </p>
                        <div className="cta-actions">
                            <a href="/register" className="cta-button primary">
                                Start Recycling Now <FaArrowRight />
                            </a>
                            <a href="/login" className="cta-button secondary">
                                Sign In to Dashboard
                            </a>
                        </div>
                        <div className="cta-extra">
                            <p>Are you a collector? <a href="/collector-register">Join our network</a></p>
                            <p>Recycling center? <a href="/partner-register">Become a partner</a></p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;