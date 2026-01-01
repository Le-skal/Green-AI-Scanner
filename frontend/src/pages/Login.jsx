import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../services/api';
import useAuthStore from '../store/authStore';

const Login = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await authAPI.login(formData);
      login(response.user, response.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-sand-50 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-ink-900 mb-2">
            Welcome Back
          </h1>
          <p className="text-ink-600">
            Sign in to access your AI aggregator
          </p>
        </div>

        {/* Login Form */}
        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="label">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="input-field"
                placeholder="your.email@example.com"
                required
                disabled={loading}
              />
            </div>

            {/* Password */}
            <div>
              <label className="label">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="input-field"
                placeholder="Enter your password"
                required
                disabled={loading}
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="border border-red-300 bg-red-50 p-3 text-red-800 text-sm">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Register Link */}
          <div className="mt-6 pt-6 border-t border-sand-300 text-center">
            <p className="text-sm text-ink-600">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="font-medium text-ink-900 hover:underline"
              >
                Create one
              </Link>
            </p>
          </div>

          {/* Skip Login */}
          <div className="mt-4 text-center">
            <Link
              to="/"
              className="text-sm text-ink-600 hover:text-ink-900 hover:underline"
            >
              Continue without logging in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
