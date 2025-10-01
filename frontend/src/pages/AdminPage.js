import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit, Trash2 } from 'lucide-react';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8001';
const API = `${API_BASE}/api`;

export default function AdminPage() {
  const [products, setProducts] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    images: '',
    color: '',
    sizes: '',
    featured: false
  });

  useEffect(() => {
    fetchProducts();
    fetchSubscribers();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API}/products`);
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchSubscribers = async () => {
    try {
      const response = await axios.get(`${API}/drops/subscribers`);
      setSubscribers(response.data);
    } catch (error) {
      console.error('Error fetching subscribers:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const productData = {
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      images: formData.images.split(',').map(url => url.trim()),
      category: 'sneakers',
      color: formData.color,
      sizes: formData.sizes.split(',').map(s => {
        const [size, stock] = s.trim().split(':');
        return { size: size.trim(), stock: parseInt(stock) || 10 };
      }),
      featured: formData.featured
    };

    try {
      await axios.post(`${API}/products`, productData);
      setShowAddForm(false);
      setFormData({
        name: '',
        description: '',
        price: '',
        images: '',
        color: '',
        sizes: '',
        featured: false
      });
      fetchProducts();
      alert('Product added successfully!');
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Failed to add product');
    }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      await axios.delete(`${API}/products/${id}`);
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0d0d0d', color: '#f2f2f2' }}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1
          className="text-5xl font-bold mb-8"
          style={{ fontFamily: "'Playfair Display', serif", color: '#D4AF37' }}
        >
          ADMIN PANEL
        </h1>

        {/* Products Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold" style={{ color: '#D4AF37' }}>
              Products ({products.length})
            </h2>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="flex items-center gap-2 px-6 py-3 font-semibold transition-all hover:scale-105"
              style={{
                backgroundColor: '#D4AF37',
                color: '#000',
                fontFamily: "'Montserrat', sans-serif",
                borderRadius: '2px'
              }}
            >
              <Plus size={20} />
              ADD PRODUCT
            </button>
          </div>

          {/* Add Product Form */}
          {showAddForm && (
            <div className="mb-6 p-6 rounded" style={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }}>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block mb-2 text-sm font-semibold">Product Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="w-full px-4 py-2 rounded"
                    style={{ backgroundColor: '#0d0d0d', color: '#f2f2f2', border: '1px solid #333' }}
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-semibold">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                    rows={3}
                    className="w-full px-4 py-2 rounded"
                    style={{ backgroundColor: '#0d0d0d', color: '#f2f2f2', border: '1px solid #333' }}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-2 text-sm font-semibold">Price ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      required
                      className="w-full px-4 py-2 rounded"
                      style={{ backgroundColor: '#0d0d0d', color: '#f2f2f2', border: '1px solid #333' }}
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-semibold">Color</label>
                    <input
                      type="text"
                      value={formData.color}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                      required
                      placeholder="e.g., black, white, red"
                      className="w-full px-4 py-2 rounded"
                      style={{ backgroundColor: '#0d0d0d', color: '#f2f2f2', border: '1px solid #333' }}
                    />
                  </div>
                </div>
                <div>
                  <label className="block mb-2 text-sm font-semibold">Image URLs (comma-separated)</label>
                  <input
                    type="text"
                    value={formData.images}
                    onChange={(e) => setFormData({ ...formData, images: e.target.value })}
                    required
                    placeholder="https://example.com/img1.jpg, https://example.com/img2.jpg"
                    className="w-full px-4 py-2 rounded"
                    style={{ backgroundColor: '#0d0d0d', color: '#f2f2f2', border: '1px solid #333' }}
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-semibold">Sizes (format: size:stock, comma-separated)</label>
                  <input
                    type="text"
                    value={formData.sizes}
                    onChange={(e) => setFormData({ ...formData, sizes: e.target.value })}
                    required
                    placeholder="8:10, 9:15, 10:20, 11:12, 12:8"
                    className="w-full px-4 py-2 rounded"
                    style={{ backgroundColor: '#0d0d0d', color: '#f2f2f2', border: '1px solid #333' }}
                  />
                </div>
                <div>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    />
                    <span className="text-sm font-semibold">Featured Product</span>
                  </label>
                </div>
                <div className="flex gap-4">
                  <button
                    type="submit"
                    className="px-6 py-3 font-semibold"
                    style={{ backgroundColor: '#D4AF37', color: '#000', borderRadius: '2px' }}
                  >
                    ADD PRODUCT
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="px-6 py-3 font-semibold"
                    style={{ backgroundColor: '#333', color: '#f2f2f2', borderRadius: '2px' }}
                  >
                    CANCEL
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Products List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((product) => (
              <div
                key={product.id}
                className="p-4 rounded"
                style={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }}
              >
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-48 object-cover rounded mb-3"
                />
                <h3 className="font-semibold mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>
                  {product.name}
                </h3>
                <p className="text-sm mb-2" style={{ color: '#999' }}>
                  ${product.price.toFixed(2)} • {product.color}
                </p>
                {product.featured && (
                  <span className="inline-block px-2 py-1 text-xs rounded mb-2" style={{ backgroundColor: '#D4AF37', color: '#000' }}>
                    FEATURED
                  </span>
                )}
                <button
                  onClick={() => deleteProduct(product.id)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 transition-colors"
                  style={{ backgroundColor: '#8B0000', color: '#fff', borderRadius: '2px' }}
                >
                  <Trash2 size={16} />
                  DELETE
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Subscribers Section */}
        <div>
          <h2 className="text-2xl font-bold mb-6" style={{ color: '#D4AF37' }}>
            Drops Subscribers ({subscribers.length})
          </h2>
          <div className="rounded overflow-hidden" style={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }}>
            <table className="w-full">
              <thead style={{ backgroundColor: '#0d0d0d' }}>
                <tr>
                  <th className="text-left px-6 py-4">Email</th>
                  <th className="text-left px-6 py-4">Subscribed Date</th>
                </tr>
              </thead>
              <tbody>
                {subscribers.map((sub, index) => (
                  <tr
                    key={sub.id}
                    style={{ borderTop: index > 0 ? '1px solid #333' : 'none' }}
                  >
                    <td className="px-6 py-4">{sub.email}</td>
                    <td className="px-6 py-4" style={{ color: '#999' }}>
                      {new Date(sub.subscribed_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
