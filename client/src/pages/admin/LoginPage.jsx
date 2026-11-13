
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiAlertCircle, FiArrowRight } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register, isAuthenticated, isAdmin } = useAuth();

  const [mode, setMode] = useState('login'); 
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const from = location.state?.from?.pathname || (isAdmin ? '/admin/dashboard' : '/my-blogs');

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (mode === 'register' && !formData.name.trim()) {
      setError('Please provide your name.');
      return;
    }

    if (!formData.email.trim() || !formData.password) {
      setError('Please provide both email and password.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    let res;
    if (mode === 'register') {
      res = await register(formData.name.trim(), formData.email.trim(), formData.password);
    } else {
      res = await login(formData.email.trim(), formData.password);
    }

    if (res.success) {
      const destination = res.user?.role === 'admin' ? '/admin/dashboard' : '/my-blogs';
      navigate(location.state?.from?.pathname || destination, { replace: true });
    } else {
      setError(res.error || 'Authentication failed. Please verify your details.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f4f4] flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">

        <h1 className="font-heading font-bold text-3xl text-[#222222] tracking-tight mb-2">
          TechBlog
        </h1>
        <p className="text-sm text-[#666666]">
          {mode === 'login'
            ? 'Sign in to submit blogs or access the dashboard'
            : 'Create an account to submit your tech articles'}
        </p>

        <div className="mt-6 inline-flex rounded border border-[#dddddd] bg-white p-1">
          <button
            type="button"
            onClick={() => { setMode('login'); setError(''); }}
            className={`px-6 py-1.5 text-xs font-semibold rounded transition-colors ${
              mode === 'login'
                ? 'bg-[#222222] text-white'
                : 'text-[#666666] hover:text-[#222222]'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setMode('register'); setError(''); }}
            className={`px-6 py-1.5 text-xs font-semibold rounded transition-colors ${
              mode === 'register'
                ? 'bg-[#222222] text-white'
                : 'text-[#666666] hover:text-[#222222]'
            }`}
          >
            Create Account
          </button>
        </div>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-sm rounded border border-[#dddddd] sm:px-10">

          {error && (
            <div className="mb-6 p-3 rounded bg-red-50 border border-red-200 flex items-start gap-2.5 text-red-700 text-sm">
              <FiAlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-red-500" />
              <div className="flex-1 font-medium">{error}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">

            {mode === 'register' && (
              <div>
                <label
                  htmlFor="name"
                  className="block text-xs font-semibold text-[#222222] mb-1"
                >
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#666666]">
                    <FiUser className="w-4 h-4" />
                  </div>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="block w-full pl-9 pr-3 py-2 text-sm text-[#222222] border border-[#dddddd] rounded focus:outline-none focus:border-[#2563eb]"
                  />
                </div>
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="block text-xs font-semibold text-[#222222] mb-1"
              >
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#666666]">
                  <FiMail className="w-4 h-4" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your.email@example.com"
                  className="block w-full pl-9 pr-3 py-2 text-sm text-[#222222] border border-[#dddddd] rounded focus:outline-none focus:border-[#2563eb]"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-xs font-semibold text-[#222222] mb-1"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#666666]">
                  <FiLock className="w-4 h-4" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••••••"
                  className="block w-full pl-9 pr-10 py-2 text-sm text-[#222222] border border-[#dddddd] rounded focus:outline-none focus:border-[#2563eb]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#666666] hover:text-[#222222]"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded text-sm font-semibold text-white bg-[#2563eb] hover:bg-[#1d4ed8] transition-colors disabled:opacity-60"
              >
                {isSubmitting ? (
                  <span>Processing...</span>
                ) : (
                  <>
                    <span>{mode === 'login' ? 'Sign In' : 'Create Account'}</span>
                    <FiArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        <div className="text-center mt-6">
          <a
            href="/"
            className="text-xs font-medium text-[#666666] hover:text-[#2563eb] transition-colors"
          >
            ← Return to Homepage
          </a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
