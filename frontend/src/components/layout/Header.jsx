import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';

const Header = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-ink-900 border-b border-ink-700">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 hover:opacity-90 transition-opacity">
            <div className="w-8 h-8 bg-sand-400 border border-sand-600"></div>
            <div>
              <h1 className="text-lg font-semibold text-sand-50">
                AI Aggregator
              </h1>
              <p className="text-xs text-sand-400">IT for Green & Data Sovereignty</p>
            </div>
          </Link>

          {/* Auth Section */}
          <div className="flex items-center space-x-6">
            {/* Active APIs Info */}
            <div className="text-right">
              <p className="text-xs text-sand-400">Active APIs</p>
              <p className="text-sm font-medium text-sand-50">Gemini · Mistral · HF · Cohere</p>
            </div>

            {/* Auth Buttons */}
            {isAuthenticated ? (
              // Logged In
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-xs text-sand-400">Welcome</p>
                  <p className="text-sm font-medium text-sand-50">{user?.name}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 border border-sand-400 text-sand-50 text-sm hover:bg-sand-400 hover:text-ink-900 transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              // Logged Out
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sand-50 text-sm hover:text-sand-400 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-sand-400 text-ink-900 text-sm hover:bg-sand-500 transition-colors"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
