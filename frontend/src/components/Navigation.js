import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Navigation() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { path: '/', label: 'HOME' },
    { path: '/shop', label: 'SHOP' },
    { path: '/cart', label: 'CART' },
    { path: '/admin', label: 'ADMIN' }
  ];

  return (
    <nav
      className="sticky top-0 z-50 border-b"
      style={{ backgroundColor: '#0d0d0d', borderColor: '#D4AF37' }}
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            className="text-2xl font-bold"
            style={{
              fontFamily: "'Playfair Display', serif",
              color: '#D4AF37'
            }}
          >
            LUXE KICKS
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="text-sm font-semibold transition-colors relative"
                style={{
                  fontFamily: "'Montserrat', sans-serif",
                  color: location.pathname === link.path ? '#D4AF37' : '#f2f2f2'
                }}
              >
                {link.label}
                {location.pathname === link.path && (
                  <div
                    className="absolute -bottom-[17px] left-0 right-0 h-0.5"
                    style={{ backgroundColor: '#D4AF37' }}
                  />
                )}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden"
            style={{ color: '#D4AF37' }}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div
            className="md:hidden py-4 border-t slide-in-right"
            style={{ borderColor: '#333' }}
          >
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className="block py-3 text-lg font-semibold transition-colors"
                style={{
                  fontFamily: "'Montserrat', sans-serif",
                  color: location.pathname === link.path ? '#D4AF37' : '#f2f2f2'
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
