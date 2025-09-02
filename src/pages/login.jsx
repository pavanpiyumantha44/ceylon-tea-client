import { useState } from 'react';
import { Eye, EyeOff, Leaf } from 'lucide-react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../app/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { login } from '../services/authService';
import { ClipLoader, PulseLoader } from 'react-spinners';
import BG from '../../public/bg.jpg';

export default function TeaFactoryLogin() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  let [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await login(formData);
      const { person, token } = response.data;
      if (response.data.success && token && person) {
        dispatch(setCredentials({ user: person, token }));
        navigate('/dashboard');
        setLoading(false);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed', {
        style: {
          backgroundColor: '#DC2626',
          color: '#fff',
        },
        position: 'top-center',
      });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex">
      <ToastContainer autoClose={2000} />
      {/* Left Side - Image with Title and Quote */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-green-400 to-green-600 relative overflow-hidden">
        <img src={BG} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-opacity-100 flex flex-col items-center justify-center text-white">
          <div className="flex items-center mb-4">
            <Leaf className="h-30 w-30 mr-2" />
            <h1 className="text-8xl font-bold">Ceylon Tea</h1>
          </div>
          <p className="text-lg font-medium text-center max-w-md">
            "Pure bliss in every sip – the timeless taste of Ceylon Tea."
          </p>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          {/* Mobile Header (visible only on mobile) */}
          <div className="text-center lg:hidden">
            <div className="flex justify-center items-center mb-6">
              <div className="bg-green-100 p-3 rounded-full">
                <Leaf className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Ceylon Tea Factory
            </h2>
            <p className="text-gray-600">Management System</p>
          </div>

          {/* Desktop Header */}
          <div className="text-center hidden lg:block">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome Back
            </h2>
            <p className="text-gray-600">Sign in to your account</p>
          </div>

          {/* Login Form */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="space-y-6">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={formData.username}
                  onChange={handleInputChange}
                  className="w-full px-3 py-3 border border-green-200 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                  placeholder="Enter your username"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full px-3 py-3 pr-10 border border-green-200 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-green-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <a href="#" className="font-medium text-green-600 hover:text-green-500 transition-colors">
                    Forgot password?
                  </a>
                </div>
              </div>

              <div>
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200 transform hover:scale-105"
                >
                  {loading ? (
                    <PulseLoader
                      color="#ffffff"
                      loading={loading}
                      cssOverride={{
                        display: 'block',
                        margin: '0 auto',
                        borderColor: '#c7c7c7',
                      }}
                      size={10}
                    />
                  ) : (
                    <span>Sign In</span>
                  )}
                </button>
              </div>
            </div>

            {/* Additional Options */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Need help accessing your account?{' '}
                <a href="#" className="font-medium text-green-600 hover:text-green-500 transition-colors">
                  Contact Administrator
                </a>
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center text-xs text-gray-500">
            <p>© 2025 Ceylon Tea Factory Management System</p>
            <p className="mt-1">Proudly serving Sri Lankan tea industry</p>
          </div>
        </div>
      </div>
    </div>
  );
}