import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/books');
    } catch (err: any) {
      setError('Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <img 
            src="/image.jpg" 
            alt="Pustakalayaexpress" 
            className="mx-auto mb-4 h-16 w-16 rounded-lg object-cover"
          />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Pustakalayaexpress</h1>
          <p className="text-gray-600">Books Management System</p>
        </div>

        <h2 className="text-xl font-semibold text-center mb-6">Login to Your Account</h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 font-medium"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="text-center mt-6 text-sm text-gray-600">
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-600 hover:text-blue-500 font-medium">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;