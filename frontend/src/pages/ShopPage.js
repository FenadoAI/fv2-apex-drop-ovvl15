import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Filter, X } from 'lucide-react';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8001';
const API = `${API_BASE}/api`;

export default function ShopPage() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedColor, setSelectedColor] = useState('');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [products, selectedColor, priceRange]);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API}/products`);
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const applyFilters = () => {
    let filtered = [...products];

    if (selectedColor) {
      filtered = filtered.filter(p => p.color.toLowerCase() === selectedColor.toLowerCase());
    }

    if (priceRange.min) {
      filtered = filtered.filter(p => p.price >= parseFloat(priceRange.min));
    }

    if (priceRange.max) {
      filtered = filtered.filter(p => p.price <= parseFloat(priceRange.max));
    }

    setFilteredProducts(filtered);
  };

  const clearFilters = () => {
    setSelectedColor('');
    setPriceRange({ min: '', max: '' });
  };

  const colors = [...new Set(products.map(p => p.color))];

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0d0d0d', color: '#f2f2f2' }}>
      {/* Header */}
      <div className="border-b" style={{ borderColor: '#333' }}>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1
            className="text-5xl font-bold"
            style={{ fontFamily: "'Playfair Display', serif", color: '#D4AF37' }}
          >
            SHOP ALL
          </h1>
          <p className="mt-2 text-lg" style={{ color: '#999' }}>
            {filteredProducts.length} products
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Filters Sidebar - Desktop */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold" style={{ color: '#D4AF37' }}>
                  FILTERS
                </h3>
                {(selectedColor || priceRange.min || priceRange.max) && (
                  <button
                    onClick={clearFilters}
                    className="text-sm underline"
                    style={{ color: '#D4AF37' }}
                  >
                    Clear All
                  </button>
                )}
              </div>

              {/* Color Filter */}
              <div className="mb-6">
                <h4 className="font-semibold mb-3">Color</h4>
                <div className="space-y-2">
                  {colors.map(color => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(selectedColor === color ? '' : color)}
                      className="w-full text-left px-4 py-2 rounded transition-colors"
                      style={{
                        backgroundColor: selectedColor === color ? '#D4AF37' : '#1a1a1a',
                        color: selectedColor === color ? '#000' : '#f2f2f2',
                        border: '1px solid #333'
                      }}
                    >
                      {color.charAt(0).toUpperCase() + color.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h4 className="font-semibold mb-3">Price Range</h4>
                <div className="space-y-3">
                  <input
                    type="number"
                    placeholder="Min"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                    className="w-full px-4 py-2 rounded"
                    style={{
                      backgroundColor: '#0d0d0d',
                      color: '#f2f2f2',
                      border: '1px solid #333'
                    }}
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                    className="w-full px-4 py-2 rounded"
                    style={{
                      backgroundColor: '#0d0d0d',
                      color: '#f2f2f2',
                      border: '1px solid #333'
                    }}
                  />
                </div>
              </div>
            </div>
          </aside>

          {/* Mobile Filter Button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden fixed bottom-4 right-4 z-50 p-4 rounded-full shadow-lg"
            style={{ backgroundColor: '#D4AF37', color: '#000' }}
          >
            <Filter size={24} />
          </button>

          {/* Mobile Filters Overlay */}
          {showFilters && (
            <div
              className="lg:hidden fixed inset-0 z-40 slide-in-right"
              style={{ backgroundColor: 'rgba(0,0,0,0.9)' }}
            >
              <div className="h-full overflow-y-auto p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold" style={{ color: '#D4AF37' }}>
                    FILTERS
                  </h3>
                  <button onClick={() => setShowFilters(false)}>
                    <X size={24} style={{ color: '#D4AF37' }} />
                  </button>
                </div>
                {/* Same filter content as desktop */}
                <div className="mb-6">
                  <h4 className="font-semibold mb-3">Color</h4>
                  <div className="space-y-2">
                    {colors.map(color => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(selectedColor === color ? '' : color)}
                        className="w-full text-left px-4 py-2 rounded"
                        style={{
                          backgroundColor: selectedColor === color ? '#D4AF37' : '#1a1a1a',
                          color: selectedColor === color ? '#000' : '#f2f2f2',
                          border: '1px solid #333'
                        }}
                      >
                        {color.charAt(0).toUpperCase() + color.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Price Range</h4>
                  <div className="space-y-3">
                    <input
                      type="number"
                      placeholder="Min"
                      value={priceRange.min}
                      onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                      className="w-full px-4 py-2 rounded"
                      style={{ backgroundColor: '#0d0d0d', color: '#f2f2f2', border: '1px solid #333' }}
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={priceRange.max}
                      onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                      className="w-full px-4 py-2 rounded"
                      style={{ backgroundColor: '#0d0d0d', color: '#f2f2f2', border: '1px solid #333' }}
                    />
                  </div>
                </div>
                <button
                  onClick={() => setShowFilters(false)}
                  className="w-full mt-6 px-6 py-3 font-semibold"
                  style={{ backgroundColor: '#D4AF37', color: '#000', borderRadius: '2px' }}
                >
                  APPLY FILTERS
                </button>
              </div>
            </div>
          )}

          {/* Products Grid */}
          <div className="flex-1">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-xl" style={{ color: '#999' }}>
                  No products match your filters
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product, index) => (
                  <Link
                    key={product.id}
                    to={`/product/${product.id}`}
                    className="group relative overflow-hidden transition-all hover:-translate-y-1"
                    style={{
                      backgroundColor: '#1a1a1a',
                      border: '1px solid #333',
                      borderRadius: '2px',
                      animationDelay: `${index * 50}ms`
                    }}
                  >
                    <div className="aspect-square overflow-hidden">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                      />
                    </div>
                    <div className="p-4">
                      <h3
                        className="text-lg font-semibold mb-2 group-hover:text-[#D4AF37] transition-colors"
                        style={{ fontFamily: "'Playfair Display', serif" }}
                      >
                        {product.name}
                      </h3>
                      <p className="text-sm mb-3" style={{ color: '#999' }}>
                        {product.description.substring(0, 60)}...
                      </p>
                      <p className="text-xl font-bold" style={{ color: '#D4AF37' }}>
                        ${product.price.toFixed(2)}
                      </p>
                    </div>
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                      style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}
                    >
                      <span
                        className="px-6 py-3 font-semibold"
                        style={{ backgroundColor: '#D4AF37', color: '#000', borderRadius: '2px' }}
                      >
                        VIEW DETAILS
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
