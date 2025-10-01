import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Trash2, ShoppingBag } from 'lucide-react';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8001';
const API = `${API_BASE}/api`;

export default function CartPage() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const userId = localStorage.getItem('userId') || 'guest';
      const response = await axios.get(`${API}/cart/${userId}`);
      setCartItems(response.data);
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (itemId) => {
    try {
      await axios.delete(`${API}/cart/${itemId}`);
      fetchCart();
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  const getTotal = () => {
    return cartItems.reduce((sum, item) => {
      return sum + (item.product.price * item.cart_item.quantity);
    }, 0);
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    alert('Stripe checkout integration ready! Add your STRIPE_SECRET_KEY to backend/.env to enable payments.');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0d0d0d', color: '#f2f2f2' }}>
        <div className="text-2xl">Loading cart...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0d0d0d', color: '#f2f2f2' }}>
      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1
          className="text-5xl font-bold mb-8"
          style={{ fontFamily: "'Playfair Display', serif", color: '#D4AF37' }}
        >
          SHOPPING CART
        </h1>

        {cartItems.length === 0 ? (
          <div className="text-center py-16">
            <ShoppingBag size={64} className="mx-auto mb-6" style={{ color: '#666' }} />
            <p className="text-2xl mb-6" style={{ color: '#999' }}>
              Your cart is empty
            </p>
            <button
              onClick={() => navigate('/shop')}
              className="px-8 py-3 font-semibold transition-all hover:scale-105"
              style={{
                backgroundColor: '#D4AF37',
                color: '#000',
                fontFamily: "'Montserrat', sans-serif",
                borderRadius: '2px'
              }}
            >
              CONTINUE SHOPPING
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.cart_item.id}
                  className="flex gap-4 p-4 rounded"
                  style={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }}
                >
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-24 h-24 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3
                      className="text-lg font-semibold mb-1"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      {item.product.name}
                    </h3>
                    <p className="text-sm mb-2" style={{ color: '#999' }}>
                      Size: {item.cart_item.size}
                    </p>
                    <p className="text-lg font-bold" style={{ color: '#D4AF37' }}>
                      ${item.product.price.toFixed(2)}
                    </p>
                    <p className="text-sm" style={{ color: '#999' }}>
                      Qty: {item.cart_item.quantity}
                    </p>
                  </div>
                  <button
                    onClick={() => removeItem(item.cart_item.id)}
                    className="p-2 transition-colors hover:text-[#8B0000]"
                    style={{ color: '#666' }}
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div>
              <div
                className="p-6 rounded sticky top-8"
                style={{ backgroundColor: '#1a1a1a', border: '2px solid #D4AF37' }}
              >
                <h3
                  className="text-2xl font-bold mb-6"
                  style={{ fontFamily: "'Playfair Display', serif", color: '#D4AF37' }}
                >
                  ORDER SUMMARY
                </h3>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span style={{ color: '#999' }}>Subtotal</span>
                    <span>${getTotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: '#999' }}>Shipping</span>
                    <span>{getTotal() >= 200 ? 'FREE' : '$15.00'}</span>
                  </div>
                  <div className="border-t pt-3" style={{ borderColor: '#333' }}>
                    <div className="flex justify-between text-xl font-bold">
                      <span>Total</span>
                      <span style={{ color: '#D4AF37' }}>
                        ${(getTotal() + (getTotal() >= 200 ? 0 : 15)).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full py-4 text-lg font-semibold transition-all hover:scale-[1.02]"
                  style={{
                    backgroundColor: '#D4AF37',
                    color: '#000',
                    fontFamily: "'Montserrat', sans-serif",
                    borderRadius: '2px'
                  }}
                >
                  PROCEED TO CHECKOUT
                </button>

                <p className="text-xs text-center mt-4" style={{ color: '#666' }}>
                  Free shipping on orders over $200
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
