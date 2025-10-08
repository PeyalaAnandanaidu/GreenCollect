import { useState } from 'react';
import './SustainableProducts.css';
import {
    FaLeaf,
    FaShoppingBag,
    FaCoins,
    FaSearch,
    FaFilter,
    FaShoppingCart,
    FaStar,
    FaTag
} from 'react-icons/fa';

interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    category: string;
    image: string;
    rating: number;
    ecoRating: number;
    tags: string[];
}

const SustainableProducts: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [userCoins, setUserCoins] = useState(350); // Sample user coins

    const products: Product[] = [
        {
            id: 1,
            name: 'Bamboo Toothbrush Set',
            description: 'Eco-friendly bamboo toothbrushes with biodegradable bristles',
            price: 50,
            category: 'Personal Care',
            image: '🌱',
            rating: 4.5,
            ecoRating: 5,
            tags: ['biodegradable', 'zero-waste', 'bamboo']
        },
        {
            id: 2,
            name: 'Reusable Coffee Cup',
            description: 'Insulated stainless steel coffee cup with silicone lid',
            price: 120,
            category: 'Kitchen',
            image: '☕',
            rating: 4.8,
            ecoRating: 4,
            tags: ['reusable', 'insulated', 'BPA-free']
        },
        {
            id: 3,
            name: 'Organic Cotton Tote Bag',
            description: 'Large capacity tote bag made from organic cotton',
            price: 80,
            category: 'Fashion',
            image: '🛍️',
            rating: 4.3,
            ecoRating: 5,
            tags: ['organic', 'reusable', 'cotton']
        },
        {
            id: 4,
            name: 'Solar Powered Charger',
            description: 'Portable solar charger for mobile devices',
            price: 200,
            category: 'Electronics',
            image: '🔋',
            rating: 4.6,
            ecoRating: 5,
            tags: ['solar', 'renewable', 'portable']
        },
        {
            id: 5,
            name: 'Beeswax Food Wraps',
            description: 'Reusable food wraps made from organic cotton and beeswax',
            price: 60,
            category: 'Kitchen',
            image: '🍯',
            rating: 4.4,
            ecoRating: 5,
            tags: ['reusable', 'beeswax', 'food-safe']
        },
        {
            id: 6,
            name: 'Solid Shampoo Bar',
            description: 'Zero-waste shampoo bar with natural ingredients',
            price: 45,
            category: 'Personal Care',
            image: '🧼',
            rating: 4.7,
            ecoRating: 5,
            tags: ['zero-waste', 'natural', 'plastic-free']
        }
    ];

    const categories = ['all', 'Personal Care', 'Kitchen', 'Fashion', 'Electronics', 'Home'];

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            product.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
        return matchesSearch && matchesCategory;
    });

    const handleRedeem = (product: Product) => {
        if (userCoins >= product.price) {
            if (window.confirm(`Are you sure you want to redeem ${product.name} for ${product.price} coins?`)) {
                setUserCoins(prev => prev - product.price);
                alert(`Successfully redeemed ${product.name}! You have ${userCoins - product.price} coins remaining.`);
            }
        } else {
            alert(`You need ${product.price - userCoins} more coins to redeem this product.`);
        }
    };

    const renderStars = (rating: number) => {
        return (
            <div className="rating-stars">
                {[1, 2, 3, 4, 5].map((star) => (
                    <FaStar
                        key={star}
                        className={star <= rating ? 'star filled' : 'star'}
                    />
                ))}
                <span className="rating-value">{rating}</span>
            </div>
        );
    };

    const renderEcoRating = (rating: number) => {
        return (
            <div className="eco-rating">
                <FaLeaf className="eco-icon" />
                <span className="eco-value">{rating}/5</span>
            </div>
        );
    };

    return (
        <div className="sustainable-products-page">
            {/* Header */}
            <div className="products-header">
                <div className="header-content">
                    <div className="header-main">
                        <h1 className="page-title">Sustainable Products</h1>
                        <p className="page-subtitle">Redeem your earned coins for eco-friendly products</p>
                    </div>
                    <div className="coins-display">
                        <div className="coins-card">
                            <FaCoins className="coins-icon" />
                            <div className="coins-info">
                                <span className="coins-label">Your Coins</span>
                                <span className="coins-amount">{userCoins}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Search and Filter */}
            <div className="products-controls">
                <div className="search-container">
                    <FaSearch className="search-icon" />
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Search products, descriptions, or tags..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="filter-container">
                    <FaFilter className="filter-icon" />
                    <select
                        className="filter-select"
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                    >
                        {categories.map(category => (
                            <option key={category} value={category}>
                                {category === 'all' ? 'All Categories' : category}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Products Grid */}
            <div className="products-grid">
                {filteredProducts.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon">🌿</div>
                        <h3>No products found</h3>
                        <p>Try adjusting your search or filter criteria</p>
                    </div>
                ) : (
                    filteredProducts.map((product) => (
                        <div key={product.id} className="product-card">
                            <div className="product-image">
                                <span className="product-emoji">{product.image}</span>
                                <div className="product-badges">
                                    {renderEcoRating(product.ecoRating)}
                                    {product.tags.includes('zero-waste') && (
                                        <span className="badge zero-waste">Zero Waste</span>
                                    )}
                                    {product.tags.includes('biodegradable') && (
                                        <span className="badge biodegradable">Biodegradable</span>
                                    )}
                                </div>
                            </div>

                            <div className="product-content">
                                <div className="product-header">
                                    <h3 className="product-name">{product.name}</h3>
                                    <div className="product-price">
                                        <FaCoins className="price-icon" />
                                        <span className="price-amount">{product.price}</span>
                                    </div>
                                </div>

                                <p className="product-description">{product.description}</p>

                                <div className="product-category">
                                    <FaTag className="category-icon" />
                                    <span>{product.category}</span>
                                </div>

                                <div className="product-rating">
                                    {renderStars(product.rating)}
                                </div>

                                <div className="product-tags">
                                    {product.tags.map((tag, index) => (
                                        <span key={index} className="product-tag">#{tag}</span>
                                    ))}
                                </div>

                                <div className="product-actions">
                                    <button
                                        className={`redeem-btn ${userCoins >= product.price ? 'available' : 'insufficient'}`}
                                        onClick={() => handleRedeem(product)}
                                        disabled={userCoins < product.price}
                                    >
                                        <FaShoppingCart className="btn-icon" />
                                        {userCoins >= product.price ? 'Redeem Now' : 'Need More Coins'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* How to Earn Section */}
            <div className="earn-coins-section">
                <h2 className="section-title">How to Earn More Coins</h2>
                <div className="earn-methods">
                    <div className="earn-method">
                        <div className="method-icon">♻️</div>
                        <h4>Schedule Pickups</h4>
                        <p>Earn 10-50 coins per waste pickup</p>
                    </div>
                    <div className="earn-method">
                        <div className="method-icon">📊</div>
                        <h4>Complete Challenges</h4>
                        <p>Participate in eco-challenges for bonus coins</p>
                    </div>
                    <div className="earn-method">
                        <div className="method-icon">👥</div>
                        <h4>Refer Friends</h4>
                        <p>Get 100 coins for each friend who joins</p>
                    </div>
                    <div className="earn-method">
                        <div className="method-icon">📝</div>
                        <h4>Provide Feedback</h4>
                        <p>Share your experience for 25 coins</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SustainableProducts;