import { useState } from 'react';
import './ProductManagement.css';
import { FaPlus, FaEdit, FaTrash, FaImage, FaRupeeSign } from 'react-icons/fa';

interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    coins: number;
    category: string;
    image: string;
    stock: number;
    isActive: boolean;
}

const ProductManagement = () => {
    const [products, setProducts] = useState<Product[]>([
        {
            id: 1,
            name: 'Eco-Friendly Water Bottle',
            description: 'Reusable stainless steel water bottle, 1L capacity',
            price: 299,
            coins: 150,
            category: 'Lifestyle',
            image: '',
            stock: 50,
            isActive: true
        },
        {
            id: 2,
            name: 'Bamboo Toothbrush Set',
            description: 'Set of 4 biodegradable bamboo toothbrushes',
            price: 199,
            coins: 80,
            category: 'Personal Care',
            image: '',
            stock: 100,
            isActive: true
        },
        {
            id: 3,
            name: 'Organic Cotton Tote Bag',
            description: 'Large reusable shopping bag made from organic cotton',
            price: 399,
            coins: 200,
            category: 'Fashion',
            image: '',
            stock: 30,
            isActive: true
        }
    ]);

    const [showAddForm, setShowAddForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: 0,
        coins: 0,
        category: '',
        stock: 0
    });

    const categories = ['Lifestyle', 'Personal Care', 'Fashion', 'Home', 'Electronics', 'Other'];

    const handleAddProduct = (e: React.FormEvent) => {
        e.preventDefault();
        const newProduct: Product = {
            id: products.length + 1,
            ...formData,
            image: '',
            isActive: true
        };
        setProducts([...products, newProduct]);
        setFormData({ name: '', description: '', price: 0, coins: 0, category: '', stock: 0 });
        setShowAddForm(false);
    };

    const handleEditProduct = (product: Product) => {
        setEditingProduct(product);
        setFormData({
            name: product.name,
            description: product.description,
            price: product.price,
            coins: product.coins,
            category: product.category,
            stock: product.stock
        });
        setShowAddForm(true);
    };

    const handleUpdateProduct = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingProduct) {
            setProducts(products.map(p => 
                p.id === editingProduct.id 
                    ? { ...p, ...formData }
                    : p
            ));
            setEditingProduct(null);
            setFormData({ name: '', description: '', price: 0, coins: 0, category: '', stock: 0 });
            setShowAddForm(false);
        }
    };

    const handleDeleteProduct = (productId: number) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            setProducts(products.filter(p => p.id !== productId));
        }
    };

    const toggleProductStatus = (productId: number) => {
        setProducts(products.map(p => 
            p.id === productId ? { ...p, isActive: !p.isActive } : p
        ));
    };

    const totalProducts = products.length;
    const activeProducts = products.filter(p => p.isActive).length;
    const outOfStockProducts = products.filter(p => p.stock === 0).length;

    return (
        <div className="product-management">
            <div className="product-header">
                <div className="header-content">
                    <h2>Eco Store Products</h2>
                    <p>Manage products available in the eco store for users to purchase with coins</p>
                </div>
                <button 
                    className="btn btn-success"
                    onClick={() => {
                        setEditingProduct(null);
                        setFormData({ name: '', description: '', price: 0, coins: 0, category: '', stock: 0 });
                        setShowAddForm(true);
                    }}
                >
                    <FaPlus /> Add New Product
                </button>
            </div>

            {/* Product Stats */}
            <div className="product-stats">
                <div className="product-stat">
                    <div className="stat-number">{totalProducts}</div>
                    <div className="stat-label">Total Products</div>
                </div>
                <div className="product-stat">
                    <div className="stat-number">{activeProducts}</div>
                    <div className="stat-label">Active Products</div>
                </div>
                <div className="product-stat">
                    <div className="stat-number">{outOfStockProducts}</div>
                    <div className="stat-label">Out of Stock</div>
                </div>
                <div className="product-stat">
                    <div className="stat-number">
                        ₹{products.reduce((sum, product) => sum + (product.price * product.stock), 0).toLocaleString()}
                    </div>
                    <div className="stat-label">Inventory Value</div>
                </div>
            </div>

            {/* Add/Edit Product Form */}
            {showAddForm && (
                <div className="product-form-overlay">
                    <div className="product-form">
                        <div className="form-header">
                            <h3>{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
                            <button 
                                className="close-btn"
                                onClick={() => setShowAddForm(false)}
                            >
                                ×
                            </button>
                        </div>
                        <form onSubmit={editingProduct ? handleUpdateProduct : handleAddProduct}>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Product Name</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={e => setFormData({...formData, name: e.target.value})}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Category</label>
                                    <select
                                        value={formData.category}
                                        onChange={e => setFormData({...formData, category: e.target.value})}
                                        required
                                    >
                                        <option value="">Select Category</option>
                                        {categories.map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group full-width">
                                    <label>Description</label>
                                    <textarea
                                        value={formData.description}
                                        onChange={e => setFormData({...formData, description: e.target.value})}
                                        rows={3}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Price (₹)</label>
                                    <input
                                        type="number"
                                        value={formData.price}
                                        onChange={e => setFormData({...formData, price: parseInt(e.target.value)})}
                                        min="0"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Coins Required</label>
                                    <input
                                        type="number"
                                        value={formData.coins}
                                        onChange={e => setFormData({...formData, coins: parseInt(e.target.value)})}
                                        min="0"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Stock Quantity</label>
                                    <input
                                        type="number"
                                        value={formData.stock}
                                        onChange={e => setFormData({...formData, stock: parseInt(e.target.value)})}
                                        min="0"
                                        required
                                    />
                                </div>
                                <div className="form-group full-width">
                                    <label>Product Image</label>
                                    <div className="image-upload">
                                        <FaImage className="upload-icon" />
                                        <span>Click to upload product image</span>
                                        <input type="file" accept="image/*" style={{ display: 'none' }} />
                                    </div>
                                </div>
                            </div>
                            <div className="form-actions">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowAddForm(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    {editingProduct ? 'Update Product' : 'Add Product'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Products List */}
            <div className="products-list">
                <div className="table-container">
                    <table className="products-table">
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>Category</th>
                                <th>Price</th>
                                <th>Coins</th>
                                <th>Stock</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map(product => (
                                <tr key={product.id} className={!product.isActive ? 'inactive' : ''}>
                                    <td>
                                        <div className="product-info">
                                            <div className="product-image">
                                                {product.image ? (
                                                    <img src={product.image} alt={product.name} />
                                                ) : (
                                                    <FaImage className="placeholder-image" />
                                                )}
                                            </div>
                                            <div className="product-details">
                                                <div className="product-name">{product.name}</div>
                                                <div className="product-desc">{product.description}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <span className="category-badge">{product.category}</span>
                                    </td>
                                    <td>
                                        <div className="price">
                                            <FaRupeeSign /> {product.price}
                                        </div>
                                    </td>
                                    <td>
                                        <div className="coins">
                                            🪙 {product.coins}
                                        </div>
                                    </td>
                                    <td>
                                        <div className={`stock ${product.stock === 0 ? 'out-of-stock' : product.stock < 10 ? 'low-stock' : ''}`}>
                                            {product.stock}
                                        </div>
                                    </td>
                                    <td>
                                        <div className={`status ${product.isActive ? 'active' : 'inactive'}`}>
                                            {product.isActive ? 'Active' : 'Inactive'}
                                        </div>
                                    </td>
                                    <td>
                                        <div className="action-buttons">
                                            <button 
                                                className="btn btn-edit"
                                                onClick={() => handleEditProduct(product)}
                                            >
                                                <FaEdit />
                                            </button>
                                            <button 
                                                className="btn btn-delete"
                                                onClick={() => handleDeleteProduct(product.id)}
                                            >
                                                <FaTrash />
                                            </button>
                                            <button 
                                                className={`btn btn-status ${product.isActive ? 'btn-warning' : 'btn-success'}`}
                                                onClick={() => toggleProductStatus(product.id)}
                                            >
                                                {product.isActive ? 'Deactivate' : 'Activate'}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ProductManagement;