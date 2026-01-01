import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../services/api';
import useAuthStore from '../store/authStore';

const Register = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
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

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    // Validate password length
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      const { confirmPassword, ...registerData } = formData;
      const response = await authAPI.register(registerData);

      // Auto-login after successful registration
      login(response.user, response.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
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
            Create Account
          </h1>
          <p className="text-ink-600">
            Join to save your prompts and history
          </p>
        </div>

        {/* Register Form */}
        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="label">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="input-field"
                placeholder="Your name"
                required
                disabled={loading}
              />
            </div>

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
                placeholder="At least 6 characters"
                required
                disabled={loading}
                minLength={6}
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label className="label">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="input-field"
                placeholder="Re-enter your password"
                required
                disabled={loading}
                minLength={6}
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
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-6 pt-6 border-t border-sand-300 text-center">
            <p className="text-sm text-ink-600">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-medium text-ink-900 hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>

          {/* Skip Registration */}
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

export default Register;
