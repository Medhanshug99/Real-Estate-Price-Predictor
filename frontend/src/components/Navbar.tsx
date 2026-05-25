import { useState, useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { Building2, Menu, X, LogOut, LayoutDashboard } from 'lucide-react';

const navLinks = [
  { to: '/predict', label: 'Price Estimator' },
  { to: '/recommend', label: 'Find Properties' },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled ? 'bg-white border-b border-stone-100 shadow-sm' : 'bg-stone-50'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0">
            <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center">
              <Building2 className="h-4.5 w-4.5 text-white" strokeWidth={2.5} />
            </div>
            <span className="font-bold text-lg text-stone-900 tracking-tight">
              Prop<span className="text-amber-500">Predict</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-amber-50 text-amber-700'
                      : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
            {role === 'admin' && (
              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-amber-50 text-amber-700'
                      : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
                  }`
                }
              >
                <LayoutDashboard className="h-4 w-4" />
                Admin
              </NavLink>
            )}
          </nav>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            {token ? (
              <button
                onClick={handleLogout}
                className="btn-secondary text-sm"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            ) : (
              <>
                <Link to="/login" className="text-sm font-medium text-stone-600 hover:text-stone-900 transition-colors px-2 py-1">
                  Sign In
                </Link>
                <Link to="/register" className="btn-primary">
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 rounded-lg text-stone-600 hover:bg-stone-100"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-stone-100 px-4 pb-4 pt-2 space-y-1">
          {navLinks.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setMobileOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-medium text-stone-700 hover:bg-stone-100"
            >
              {label}
            </NavLink>
          ))}
          <div className="pt-2 border-t border-stone-100">
            {token ? (
              <button onClick={handleLogout} className="w-full btn-secondary mt-2">Sign Out</button>
            ) : (
              <Link to="/login" onClick={() => setMobileOpen(false)} className="block btn-primary mt-2 text-center">
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
