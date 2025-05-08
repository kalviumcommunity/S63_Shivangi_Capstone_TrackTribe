
import React, { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';

const SignUpLogin = () => {
  const [mode, setMode] = useState('signin');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Add these missing functions
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      // Determine endpoint based on mode
      const endpoint = mode === 'signup' 
        ? 'http://localhost:6969/api/auth/signup'
        : 'http://localhost:6969/api/auth/login';
  
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        setSuccess(true);
        // Store token in localStorage
        localStorage.setItem('token', data.token);
        console.log(`${mode === 'signup' ? 'Signup' : 'Login'} successful:`, data);
        
        // Reset after success
        setTimeout(() => {
          setSuccess(false);
          // Navigate to dashboard or home page
        }, 2000);
      } else {
        throw new Error(data.message || 'Authentication failed');
      }
    } catch (error) {
      console.error('Auth error:', error);
      // Add error handling UI here
    } finally {
      setLoading(false);
    }
  };

  // ... existing handleChange and handleSubmit functions ...

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-900 via-black to-pink-900">
      <div className="relative w-full max-w-md p-8">
        {/* Enhanced card with built-in animations */}
        <div className="relative bg-black bg-opacity-70 backdrop-blur-md rounded-xl p-8 shadow-xl border border-cyan-500 border-opacity-30 group hover:shadow-cyan-500/20 transition-all duration-300">
          {/* Animated glow using opacity transitions */}
          <div className={`absolute -inset-0.5 bg-gradient-to-r from-pink-600 via-purple-500 to-cyan-500 rounded-xl blur-md transition-opacity duration-500
            ${loading ? 'opacity-40 animate-pulse' : 'opacity-20 group-hover:opacity-30'}
            ${success ? 'opacity-60 via-green-500' : ''}`}
          />

          {/* Content container with relative positioning */}
          <div className="relative">
            {/* Animated title */}
            <h2 className={`text-3xl font-bold text-center mb-8 transition-all duration-500
              ${success ? 'text-green-400 scale-105' : 'text-indigo-400'}
              hover:text-opacity-90`}
            >
              {success ? 'Success!' : mode === 'signup' ? 'Create Account' : 'Welcome Back'}
            </h2>

            {/* Toggle buttons with enhanced hover effects */}
            <div className="flex justify-center gap-4 mb-8">
              <button
                onClick={() => setMode('signin')}
                disabled={loading}
                className={`px-6 py-2.5 rounded-full transform transition-all duration-300 ease-out
                  ${mode === 'signin'
                    ? 'bg-gradient-to-r from-pink-500 to-indigo-600 text-white scale-105 shadow-lg shadow-pink-500/25'
                    : 'text-gray-400 hover:text-white hover:scale-102 hover:shadow-md hover:shadow-pink-500/20'
                  } ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:-translate-y-0.5'}`}
              >
                Sign In
              </button>
              <button
                onClick={() => setMode('signup')}
                disabled={loading}
                className={`px-6 py-2.5 rounded-full transform transition-all duration-300 ease-out
                  ${mode === 'signup'
                    ? 'bg-gradient-to-r from-cyan-500 to-emerald-500 text-white scale-105 shadow-lg shadow-cyan-500/25'
                    : 'text-gray-400 hover:text-white hover:scale-102 hover:shadow-md hover:shadow-cyan-500/20'
                  } ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:-translate-y-0.5'}`}
              >
                Sign Up
              </button>
            </div>

            {/* Success message with animation */}
            {success && (
              <div className="text-green-400 text-sm text-center mb-4 bg-green-900/20 py-2 px-3 rounded-md border border-green-800 animate-pulse">
                {mode === 'signup' ? 'Account created successfully!' : 'Signed in successfully!'}
              </div>
            )}

            {/* Form with enhanced input styles */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'signup' && (
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Full Name"
                  className="w-full p-3 bg-black/50 rounded-lg border border-purple-900 text-white placeholder-gray-400 
                    focus:ring-2 focus:ring-cyan-500 focus:border-transparent transform transition-all duration-300
                    hover:border-cyan-500/50 hover:shadow-sm hover:shadow-cyan-500/20"
                  required
                  disabled={loading || success}
                />
              )}
              
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                className="w-full p-3 bg-black/50 rounded-lg border border-purple-900 text-white placeholder-gray-400 
                  focus:ring-2 focus:ring-cyan-500 focus:border-transparent transform transition-all duration-300
                  hover:border-cyan-500/50 hover:shadow-sm hover:shadow-cyan-500/20"
                required
                disabled={loading || success}
              />
              
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                className="w-full p-3 bg-black/50 rounded-lg border border-purple-900 text-white placeholder-gray-400 
                  focus:ring-2 focus:ring-cyan-500 focus:border-transparent transform transition-all duration-300
                  hover:border-cyan-500/50 hover:shadow-sm hover:shadow-cyan-500/20"
                required
                disabled={loading || success}
              />

              <button
                type="submit"
                disabled={loading || success}
                className={`w-full py-3 rounded-lg font-semibold text-white transform transition-all duration-300
                  ${mode === 'signup'
                    ? 'bg-gradient-to-r from-cyan-500 to-emerald-500 hover:shadow-lg hover:shadow-cyan-500/25'
                    : 'bg-gradient-to-r from-pink-500 to-indigo-500 hover:shadow-lg hover:shadow-pink-500/25'
                  } ${loading || success ? 'opacity-80 cursor-not-allowed' : 'hover:scale-[1.02] hover:-translate-y-0.5'}`}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    {mode === 'signup' ? 'Creating Account...' : 'Signing In...'}
                  </div>
                ) : (
                  mode === 'signup' ? 'Sign Up' : 'Sign In'
                )}
              </button>

              <div className="relative flex items-center justify-center my-4">
                <div className="border-t border-gray-600 w-full" />
                <div className="bg-transparent px-4 text-gray-400">or</div>
                <div className="border-t border-gray-600 w-full" />
              </div>

              <button
                type="button"
                disabled={loading || success}
                className={`w-full flex items-center justify-center gap-2 p-3 border border-purple-900 rounded-lg text-white 
                  transform transition-all duration-300 
                  ${mode === 'signup'
                    ? 'hover:border-cyan-500 hover:shadow-lg hover:shadow-cyan-500/20'
                    : 'hover:border-pink-500 hover:shadow-lg hover:shadow-pink-500/20'
                  } ${loading || success ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.02] hover:-translate-y-0.5'}`}
              >
                <FcGoogle size={20} />
                <span>Sign {mode === 'signup' ? 'up' : 'in'} with Google</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpLogin;