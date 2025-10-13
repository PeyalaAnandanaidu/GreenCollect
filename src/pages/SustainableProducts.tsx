import { useState,useEffect } from 'react';
import { Link } from 'react-router-dom';
import './SustainableProducts.css';
import {
    FaLeaf,
    FaShoppingBag,
    FaCoins,
    FaSearch,
    FaShoppingCart,
    FaStar,
    FaTag,
    FaHeart,
    FaShare,
    FaEye
} from 'react-icons/fa';

interface Product {
    id: string;
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
    const [userCoins] = useState(1250);
    const [wishlist, setWishlist] = useState<String[]>([]);

    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    useEffect(() => {
        const fetchProducts = async () => {
            console.log('Fetching products from backend...');
            try {
                const response = await fetch('http://localhost:4000/api/products');
                const data = await response.json();
    
                if (!response.ok) throw new Error(data.message || 'Failed to fetch products');
    
                // Map backend fields to your frontend Product interface
                const formattedProducts: Product[] = data.products.map((p: any) => ({
                    id: p._id,
                    name: p.productName,
                    description: p.description,
                    price: p.price,
                    originalPrice: p.originalPrice,
                    category: p.category,
                    image: p.productImage || '',
                    rating: p.rating ?? 4.5, // default if not present
                    ecoRating: p.ecoRating ?? 5,
                    tags: p.tags ?? [],
                    inStock: p.inStock ?? true,
                    fastDelivery: p.fastDelivery ?? false,
                    reviews: p.reviews ?? 0,
                }));
    
                setProducts(formattedProducts);
            } catch (err: any) {
                console.error(err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
    
        fetchProducts();
    }, []);
    

    const categories = ['all', 'Personal Care', 'Kitchen', 'Fashion', 'Electronics', 'Home'];

    // Stats data matching dashboard
    const productStats = {
        totalProducts: products.length,
        affordableProducts: products.filter(p => p.price <= userCoins).length,
        totalValue: products.reduce((sum, product) => sum + product.price, 0),
        averageRating: products.length > 0
    ? (products.reduce((sum, product) => sum + product.rating, 0) / products.length).toFixed(1)
    : '0.0'

    };

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            product.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
                            const matchesCategory =
                            categoryFilter === 'all' ||
                            product.category.toLowerCase() === categoryFilter.toLowerCase();                          
        return matchesSearch && matchesCategory;
    });

    // Navigation to /redeem is handled via Link in the CTA button.

    const toggleWishlist = (productId: string) => {
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
                                    {(userCoins >= product.price && product.inStock) ? (
                                        <Link
                                            className="redeem-btn available"
                                            to="/redeem"
                                            state={{ product }}
                                        >
                                            <FaShoppingCart className="btn-icon" />
                                            Redeem Now
                                        </Link>
                                    ) : (
                                        <button className="redeem-btn insufficient" disabled>
                                            <FaShoppingCart className="btn-icon" />
                                            {!product.inStock ? 'Out of Stock' : `Need ${product.price - userCoins} More`}
                                        </button>
                                    )}
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