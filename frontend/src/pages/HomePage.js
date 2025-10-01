import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8001';
const API = `${API_BASE}/api`;

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      const response = await axios.get(`${API}/products?featured=true`);
      setFeaturedProducts(response.data.slice(0, 4));
    } catch (error) {
      console.error('Error fetching featured products:', error);
    }
  };

  const handleSubscribe = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/drops/subscribe`, { email });
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    } catch (error) {
      console.error('Error subscribing:', error);
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0d0d0d', color: '#f2f2f2' }}>
      {/* Hero Section */}
      <section
        className="relative h-[85vh] flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: 'linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.3)), url(https://images.unsplash.com/photo-1556906781-9a412961c28c?w=1920&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="text-center z-10 px-4 fade-up">
          <h1
            className="text-6xl md:text-7xl font-bold mb-6"
            style={{
              fontFamily: "'Playfair Display', serif",
              color: '#D4AF37',
              textShadow: '2px 2px 4px rgba(0,0,0,0.8)'
            }}
          >
            ELEVATE YOUR STYLE
          </h1>
          <p className="text-xl md:text-2xl mb-8" style={{ color: '#f2f2f2' }}>
            Premium sneakers for the discerning collector
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center px-8 py-4 text-lg font-semibold transition-all hover:scale-105"
            style={{
              backgroundColor: '#D4AF37',
              color: '#000000',
              fontFamily: "'Montserrat', sans-serif",
              borderRadius: '2px'
            }}
          >
            SHOP NOW
            <ChevronRight className="ml-2" size={24} />
          </Link>
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2
          className="text-4xl font-bold text-center mb-12"
          style={{
            fontFamily: "'Playfair Display', serif",
            color: '#D4AF37'
          }}
        >
          FEATURED COLLECTION
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product, index) => (
            <Link
              key={product.id}
              to={`/product/${product.id}`}
              className="group relative overflow-hidden transition-all hover:-translate-y-1"
              style={{
                backgroundColor: '#1a1a1a',
                border: '1px solid #333',
                borderRadius: '2px',
                animationDelay: `${index * 100}ms`
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
                  style={{
                    backgroundColor: '#D4AF37',
                    color: '#000',
                    borderRadius: '2px'
                  }}
                >
                  QUICK VIEW
                </span>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            to="/shop"
            className="inline-block px-8 py-3 font-semibold transition-all hover:scale-105"
            style={{
              backgroundColor: 'transparent',
              color: '#D4AF37',
              border: '2px solid #D4AF37',
              borderRadius: '2px'
            }}
          >
            VIEW ALL PRODUCTS
          </Link>
        </div>
      </section>

      {/* Drops Notification Signup */}
      <section
        className="py-16"
        style={{
          backgroundColor: '#8B0000',
          borderTop: '2px solid #D4AF37',
          borderBottom: '2px solid #D4AF37'
        }}
      >
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2
            className="text-3xl md:text-4xl font-bold mb-4"
            style={{ fontFamily: "'Playfair Display', serif", color: '#fff' }}
          >
            NEVER MISS A DROP
          </h2>
          <p className="text-lg mb-8" style={{ color: '#f2f2f2' }}>
            Subscribe to get notified about exclusive releases and limited editions
          </p>

          {subscribed ? (
            <div
              className="inline-block px-8 py-4 text-lg font-semibold scale-up"
              style={{ backgroundColor: '#D4AF37', color: '#000', borderRadius: '2px' }}
            >
              ✓ SUCCESSFULLY SUBSCRIBED!
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex flex-col md:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="flex-1 px-6 py-4 text-lg"
                style={{
                  backgroundColor: '#0d0d0d',
                  color: '#f2f2f2',
                  border: '2px solid #D4AF37',
                  borderRadius: '2px'
                }}
              />
              <button
                type="submit"
                className="px-8 py-4 text-lg font-semibold transition-all hover:scale-105"
                style={{
                  backgroundColor: '#D4AF37',
                  color: '#000',
                  fontFamily: "'Montserrat', sans-serif",
                  borderRadius: '2px'
                }}
              >
                SUBSCRIBE
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Brand Story */}
      <section className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h2
          className="text-4xl font-bold mb-6"
          style={{ fontFamily: "'Playfair Display', serif", color: '#D4AF37' }}
        >
          WHERE LUXURY MEETS STREET
        </h2>
        <p className="text-lg leading-relaxed" style={{ color: '#ccc' }}>
          We curate the finest sneakers from around the world, bringing you exclusive drops
          and limited editions that define modern sneaker culture. Every pair tells a story,
          every release is an event. Join the elite community of sneaker enthusiasts who
          demand nothing but the best.
        </p>
      </section>
    </div>
  );
}
