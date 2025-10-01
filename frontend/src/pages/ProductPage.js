import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ShoppingCart, Check } from 'lucide-react';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8001';
const API = `${API_BASE}/api`;

export default function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedImage, setSelectedImage] = useState(0);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await axios.get(`${API}/products/${id}`);
      setProduct(response.data);
    } catch (error) {
      console.error('Error fetching product:', error);
    }
  };

  const handleAddToCart = async () => {
    if (!selectedSize) {
      alert('Please select a size');
      return;
    }

    try {
      // Using a guest user ID for demo
      const userId = localStorage.getItem('userId') || 'guest_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('userId', userId);

      await axios.post(`${API}/cart/add`, {
        user_id: userId,
        product_id: product.id,
        size: selectedSize,
        quantity: 1
      });

      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add to cart');
    }
  };

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0d0d0d', color: '#f2f2f2' }}>
        <div className="text-2xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0d0d0d', color: '#f2f2f2' }}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <button
          onClick={() => navigate('/shop')}
          className="mb-6 px-4 py-2 transition-colors"
          style={{ color: '#D4AF37' }}
        >
          ← Back to Shop
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Images */}
          <div>
            <div className="aspect-square overflow-hidden mb-4 rounded" style={{ border: '2px solid #333' }}>
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className="aspect-square overflow-hidden rounded transition-all"
                    style={{
                      border: selectedImage === index ? '2px solid #D4AF37' : '1px solid #333',
                      opacity: selectedImage === index ? 1 : 0.6
                    }}
                  >
                    <img src={img} alt={`View ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div>
            <h1
              className="text-4xl md:text-5xl font-bold mb-4"
              style={{ fontFamily: "'Playfair Display', serif", color: '#f2f2f2' }}
            >
              {product.name}
            </h1>

            <p className="text-3xl font-bold mb-6" style={{ color: '#D4AF37' }}>
              ${product.price.toFixed(2)}
            </p>

            <p className="text-lg mb-8 leading-relaxed" style={{ color: '#ccc' }}>
              {product.description}
            </p>

            {/* Color */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold mb-2" style={{ color: '#999' }}>
                COLOR
              </h3>
              <div className="px-4 py-2 inline-block rounded" style={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }}>
                {product.color.charAt(0).toUpperCase() + product.color.slice(1)}
              </div>
            </div>

            {/* Size Selector */}
            <div className="mb-8">
              <h3 className="text-sm font-semibold mb-3" style={{ color: '#999' }}>
                SELECT SIZE
              </h3>
              <div className="grid grid-cols-5 gap-3">
                {product.sizes.map((sizeObj) => {
                  const isAvailable = sizeObj.stock > 0;
                  const isSelected = selectedSize === sizeObj.size;

                  return (
                    <button
                      key={sizeObj.size}
                      onClick={() => isAvailable && setSelectedSize(sizeObj.size)}
                      disabled={!isAvailable}
                      className="aspect-square flex items-center justify-center text-lg font-semibold transition-all relative"
                      style={{
                        backgroundColor: isSelected ? '#D4AF37' : '#1a1a1a',
                        color: isSelected ? '#000' : isAvailable ? '#f2f2f2' : '#666',
                        border: isSelected ? '2px solid #D4AF37' : '1px solid #333',
                        borderRadius: '2px',
                        cursor: isAvailable ? 'pointer' : 'not-allowed',
                        opacity: isAvailable ? 1 : 0.5
                      }}
                    >
                      {sizeObj.size}
                      {!isAvailable && (
                        <div
                          className="absolute inset-0 flex items-center justify-center"
                          style={{
                            background: 'linear-gradient(45deg, transparent 45%, #8B0000 45%, #8B0000 55%, transparent 55%)'
                          }}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={added}
              className="w-full py-4 text-lg font-semibold transition-all hover:scale-[1.02] flex items-center justify-center gap-3"
              style={{
                backgroundColor: added ? '#4BB543' : '#D4AF37',
                color: '#000',
                fontFamily: "'Montserrat', sans-serif",
                borderRadius: '2px'
              }}
            >
              {added ? (
                <>
                  <Check size={24} />
                  ADDED TO CART
                </>
              ) : (
                <>
                  <ShoppingCart size={24} />
                  ADD TO CART
                </>
              )}
            </button>

            {/* Product Info */}
            <div className="mt-8 p-6 rounded" style={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }}>
              <h4 className="font-semibold mb-4" style={{ color: '#D4AF37' }}>
                PRODUCT DETAILS
              </h4>
              <ul className="space-y-2" style={{ color: '#ccc' }}>
                <li>• Premium materials and craftsmanship</li>
                <li>• Authentic and verified</li>
                <li>• Limited availability</li>
                <li>• Free shipping on orders over $200</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
