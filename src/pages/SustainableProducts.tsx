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
    FaTag,
    FaHeart,
    FaShare,
    FaEye
} from 'react-icons/fa';

interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    originalPrice?: number;
    category: string;
    image: string;
    rating: number;
    ecoRating: number;
    tags: string[];
    inStock: boolean;
    fastDelivery: boolean;
    reviews: number;
}

const SustainableProducts: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [userCoins, setUserCoins] = useState(1250);
    const [wishlist, setWishlist] = useState<number[]>([]);

    const products: Product[] = [
        {
            id: 1,
            name: 'Premium Bamboo Toothbrush Set - 4 Pack',
            description: 'Eco-friendly bamboo toothbrushes with biodegradable charcoal bristles. Perfect for zero-waste bathroom routine and sustainable oral care.',
            price: 50,
            originalPrice: 70,
            category: 'Personal Care',
            image: 'https://images.unsplash.com/photo-1584305574647-0cc949a2bfbd?w=600&h=400&fit=crop',
            rating: 4.5,
            ecoRating: 5,
            tags: ['biodegradable', 'zero-waste', 'bamboo', 'charcoal'],
            inStock: true,
            fastDelivery: true,
            reviews: 128
        },
        {
            id: 2,
            name: 'Insulated Stainless Steel Coffee Cup',
            description: 'Double-walled insulated stainless steel coffee cup with leak-proof silicone lid. Keep your drinks hot for 6 hours or cold for 12 hours.',
            price: 120,
            originalPrice: 150,
            category: 'Kitchen',
            image: 'https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=600&h=400&fit=crop',
            rating: 4.8,
            ecoRating: 4,
            tags: ['reusable', 'insulated', 'BPA-free', 'stainless-steel'],
            inStock: true,
            fastDelivery: true,
            reviews: 256
        },
        {
            id: 3,
            name: 'Organic Cotton Canvas Tote Bag',
            description: 'Extra large capacity tote bag made from 100% organic cotton canvas. Water-resistant and perfect for grocery shopping or beach trips.',
            price: 80,
            category: 'Fashion',
            image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=400&fit=crop',
            rating: 4.3,
            ecoRating: 5,
            tags: ['organic', 'reusable', 'cotton', 'canvas'],
            inStock: true,
            fastDelivery: false,
            reviews: 89
        },
        {
            id: 4,
            name: 'Portable Solar Power Bank Charger',
            description: 'High-efficiency solar charger with 20,000mAh capacity. Fast charging for all devices with built-in LED flashlight and waterproof design.',
            price: 200,
            originalPrice: 250,
            category: 'Electronics',
            image: 'https://images.unsplash.com/photo-1609592810793-abeb6c64b5c6?w=600&h=400&fit=crop',
            rating: 4.6,
            ecoRating: 5,
            tags: ['solar', 'renewable', 'portable', 'power-bank'],
            inStock: true,
            fastDelivery: true,
            reviews: 342
        },
        {
            id: 5,
            name: 'Natural Beeswax Food Wrap Set',
            description: 'Reusable food wraps made from organic cotton, beeswax, and tree resin. Perfect alternative to plastic wrap for sustainable food storage.',
            price: 60,
            category: 'Kitchen',
            image: 'https://images.unsplash.com/photo-1570194065650-2f4c1f306bcc?w=600&h=400&fit=crop',
            rating: 4.4,
            ecoRating: 5,
            tags: ['reusable', 'beeswax', 'food-safe', 'plastic-free'],
            inStock: true,
            fastDelivery: true,
            reviews: 167
        },
        {
            id: 6,
            name: 'Natural Shampoo & Conditioner Bars',
            description: 'Zero-waste shampoo and conditioner bars with argan oil and lavender. Lasts 2-3 times longer than traditional liquid shampoo.',
            price: 45,
            originalPrice: 60,
            category: 'Personal Care',
            image: 'https://images.unsplash.com/photo-1594736797933-d0ea3ff8db41?w=600&h=400&fit=crop',
            rating: 4.7,
            ecoRating: 5,
            tags: ['zero-waste', 'natural', 'plastic-free', 'vegan'],
            inStock: true,
            fastDelivery: false,
            reviews: 203
        },
        {
            id: 7,
            name: 'Stainless Steel Straw Kit with Case',
            description: 'Complete reusable straw kit with 4 stainless steel straws, cleaning brushes, and carrying case. Say no to single-use plastic straws.',
            price: 35,
            category: 'Kitchen',
            image: 'https://images.unsplash.com/photo-1589363460777-cb6f6d5d7f20?w=600&h=400&fit=crop',
            rating: 4.2,
            ecoRating: 4,
            tags: ['reusable', 'stainless-steel', 'plastic-free', 'travel'],
            inStock: true,
            fastDelivery: true,
            reviews: 94
        },
        {
            id: 8,
            name: 'Sustainable Hemp Backpack - Large',
            description: 'Durable and spacious backpack made from sustainable hemp fiber. Multiple compartments and laptop sleeve included.',
            price: 150,
            originalPrice: 180,
            category: 'Fashion',
            image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=400&fit=crop',
            rating: 4.5,
            ecoRating: 5,
            tags: ['hemp', 'sustainable', 'durable', 'laptop-friendly'],
            inStock: true,
            fastDelivery: true,
            reviews: 178
        },
        {
            id: 9,
            name: 'Glass Food Storage Container Set',
            description: '12-piece borosilicate glass food storage containers with bamboo lids. Oven, microwave, and dishwasher safe.',
            price: 90,
            originalPrice: 120,
            category: 'Kitchen',
            image: 'https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=600&h=400&fit=crop',
            rating: 4.6,
            ecoRating: 5,
            tags: ['glass', 'reusable', 'bamboo', 'food-storage'],
            inStock: true,
            fastDelivery: true,
            reviews: 231
        },
        {
            id: 10,
            name: 'Organic Cotton Produce Bags Set',
            description: 'Set of 8 reusable mesh produce bags in various sizes. Perfect for zero-waste grocery shopping and farmers markets.',
            price: 25,
            category: 'Home',
            image: 'https://images.unsplash.com/photo-1584305574647-0cc949a2bfbd?w=600&h=400&fit=crop',
            rating: 4.3,
            ecoRating: 5,
            tags: ['organic', 'mesh', 'produce', 'zero-waste'],
            inStock: true,
            fastDelivery: false,
            reviews: 112
        }
    ];

    const categories = ['all', 'Personal Care', 'Kitchen', 'Fashion', 'Electronics', 'Home'];

    // Stats data matching dashboard
    const productStats = {
        totalProducts: products.length,
        affordableProducts: products.filter(p => p.price <= userCoins).length,
        totalValue: products.reduce((sum, product) => sum + product.price, 0),
        averageRating: (products.reduce((sum, product) => sum + product.rating, 0) / products.length).toFixed(1)
    };

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

    const toggleWishlist = (productId: number) => {
        setWishlist(prev => 
            prev.includes(productId) 
                ? prev.filter(id => id !== productId)
                : [...prev, productId]
        );
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
                <span className="eco-value">{rating}/5 Eco</span>
            </div>
        );
    };

    const getDiscount = (originalPrice: number, price: number) => {
        return Math.round(((originalPrice - price) / originalPrice) * 100);
    };

    return (
        <div className="sustainable-products-page">
           

            {/* Stats Cards */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon">
                        <FaShoppingBag />
                    </div>
                    <div className="stat-content">
                        <h3>{productStats.totalProducts}</h3>
                        <p>Available Products</p>
                        <span className="stat-trend positive">+5 new this week</span>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">
                        <FaCoins />
                    </div>
                    <div className="stat-content">
                        <h3>{productStats.affordableProducts}</h3>
                        <p>Products You Can Afford</p>
                        <span className="stat-trend positive">+{Math.floor(productStats.affordableProducts * 0.15)} more</span>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">
                        <FaStar />
                    </div>
                    <div className="stat-content">
                        <h3>{productStats.averageRating}</h3>
                        <p>Average Rating</p>
                        <span className="stat-trend positive">⭐ Excellent Quality</span>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">
                        <FaLeaf />
                    </div>
                    <div className="stat-content">
                        <h3>4.8/5</h3>
                        <p>Average Eco Rating</p>
                        <span className="stat-trend positive">🌿 Very Sustainable</span>
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
                        placeholder="Search sustainable products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="filter-container">
                   
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
                            <div className="product-image-container">
                                <div className="productImage">
                                    <img src={product.image} alt={product.name} />
                                    <div className="image-overlay">
                                        <button 
                                            className={`wishlist-btn ${wishlist.includes(product.id) ? 'active' : ''}`}
                                            onClick={() => toggleWishlist(product.id)}
                                        >
                                            <FaHeart />
                                        </button>
                                        <button className="quick-view-btn">
                                            <FaEye />
                                        </button>
                                        <button className="share-btn">
                                            <FaShare />
                                        </button>
                                    </div>
                                    {product.originalPrice && (
                                        <div className="discount-badge">
                                            -{getDiscount(product.originalPrice, product.price)}%
                                        </div>
                                    )}
                                </div>
                                <div className="product-badges">
                                    {renderEcoRating(product.ecoRating)}
                                    {product.fastDelivery && (
                                        <span className="badge delivery-badge">Fast Delivery</span>
                                    )}
                                    {!product.inStock && (
                                        <span className="badge out-of-stock">Out of Stock</span>
                                    )}
                                </div>
                            </div>

                            <div className="product-content">
                                <div className="product-header-1">
                                    <h3 className="product-name">{product.name}</h3>
                                    <div className="product-price-section">
                                        {product.originalPrice && (
                                            <span className="original-price">{product.originalPrice} coins</span>
                                        )}
                                        <div className="product-price">
                                            <FaCoins className="price-icon" />
                                            <span className="price-amount">{product.price}</span>
                                        </div>
                                    </div>
                                </div>

                                <p className="product-description">{product.description}</p>

                                <div className="product-meta">
                                    <div className="rating-section">
                                        {renderStars(product.rating)}
                                        <span className="review-count">({product.reviews} reviews)</span>
                                    </div>
                                    
                                    <div className="product-category">
                                        <FaTag className="category-icon" />
                                        <span>{product.category}</span>
                                    </div>
                                </div>

                                <div className="product-tags">
                                    {product.tags.map((tag, index) => (
                                        <span key={index} className="product-tag">#{tag}</span>
                                    ))}
                                </div>

                                <div className="product-actions">
                                    <button
                                        className={`redeem-btn ${userCoins >= product.price && product.inStock ? 'available' : 'insufficient'}`}
                                        onClick={() => handleRedeem(product)}
                                        disabled={userCoins < product.price || !product.inStock}
                                    >
                                        <FaShoppingCart className="btn-icon" />
                                        {!product.inStock ? 'Out of Stock' : 
                                         userCoins >= product.price ? 'Redeem Now' : 
                                         `Need ${product.price - userCoins} More`}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* How to Earn Section */}
            <div className="earn-coins-section">
                <h2 className="section-title">How to Earn More Eco Coins</h2>
                <div className="earn-methods">
                    <div className="earn-method">
                        <div className="method-icon">♻️</div>
                        <h4>Recycle & Earn</h4>
                        <p>10-50 coins per pickup • Bonus for electronics</p>
                        <span className="method-bonus">+25% this month</span>
                    </div>
                    <div className="earn-method">
                        <div className="method-icon">🏆</div>
                        <h4>Complete Challenges</h4>
                        <p>Weekly eco-challenges • 100-500 coins each</p>
                        <span className="method-bonus">3 active now</span>
                    </div>
                    <div className="earn-method">
                        <div className="method-icon">👥</div>
                        <h4>Refer Friends</h4>
                        <p>100 coins per friend • 50 coins when they recycle</p>
                        <span className="method-bonus">Most popular</span>
                    </div>
                    <div className="earn-method">
                        <div className="method-icon">💡</div>
                        <h4>Eco Tips & Feedback</h4>
                        <p>Share suggestions • Review products • 25 coins each</p>
                        <span className="method-bonus">Easy coins</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SustainableProducts;