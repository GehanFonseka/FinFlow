import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@material-tailwind/react";
import logo from '../assets/images/logo.jpg';

export const Home = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/auth/login');
  };

  const handleSignUp = () => {
    navigate('/auth/signup');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Navigation - Updated with black background */}
      <nav className="fixed top-0 w-full bg-black/95 backdrop-blur-lg shadow-md z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-3">
              <img src={logo} alt="FinFlow Logo" className="h-12 w-auto" />
              <span className="text-2xl font-bold text-white">
                
              </span>
            </div>
            <div className="flex items-center space-x-6">
              <button
                onClick={handleLogin}
                className="px-6 py-2 text-white font-semibold hover:text-[#25C935] transition-colors"
              >
                Login
              </button>
              <button
                onClick={handleSignUp}
                className="px-6 py-2 rounded-full border-2 border-[#25C935] text-[#25C935] font-semibold hover:bg-[#25C935] hover:text-black transition-all duration-300"
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="pt-40 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-8">
            <div className="inline-block px-4 py-1.5 bg-[#25C935]/10 rounded-full mb-4">
              <span className="text-[#1ea32b] font-semibold">✨ Smart Financial Management</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Manage Your Finances with
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#25C935] to-[#1ea32b] mt-2">
                Voice & AI Technology
              </span>
            </h1>
            <p className="max-w-2xl mx-auto text-lg sm:text-xl text-gray-600 leading-relaxed">
              Track income, manage expenses, plan budgets, and achieve savings goals
              with voice commands and AI-powered financial advice.
            </p>
            <div className="flex justify-center space-x-4 mt-8">
              <Button
                onClick={handleSignUp}
                className="bg-gradient-to-r from-[#25C935] to-[#1ea32b] px-8 py-3.5 text-base font-semibold shadow-lg hover:shadow-xl hover:from-[#1ea32b] hover:to-[#25C935] transition-all duration-300"
              >
                Get Started Free
              </Button>
              <a href="#features" className="inline-flex items-center px-8 py-3.5 text-base font-semibold text-gray-600 hover:text-gray-900 transition-colors">
                Learn More ↓
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="py-24 bg-white/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Smart Features for Smart Finance
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience the future of personal finance management with our cutting-edge features
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature Cards */}
            <div className="p-8 rounded-2xl bg-white shadow-md hover:shadow-xl transition-shadow duration-300">
              <div className="text-[#25C935] text-3xl mb-4">🎯</div>
              <h3 className="text-xl font-bold mb-3">Voice-Enabled</h3>
              <p className="text-gray-600 leading-relaxed">Control your finances hands-free with voice commands</p>
            </div>

            <div className="p-8 rounded-2xl bg-white shadow-md hover:shadow-xl transition-shadow duration-300">
              <div className="text-[#25C935] text-3xl mb-4">🤖</div>
              <h3 className="text-xl font-bold mb-3">AI-Powered</h3>
              <p className="text-gray-600 leading-relaxed">Get smart financial advice</p>
            </div>

            <div className="p-8 rounded-2xl bg-white shadow-md hover:shadow-xl transition-shadow duration-300">
              <div className="text-[#25C935] text-3xl mb-4">📊</div>
              <h3 className="text-xl font-bold mb-3">Budget Tracking</h3>
              <p className="text-gray-600 leading-relaxed">Manage and track your expenses effectively</p>
            </div>

            <div className="p-8 rounded-2xl bg-white shadow-md hover:shadow-xl transition-shadow duration-300">
              <div className="text-[#25C935] text-3xl mb-4">💰</div>
              <h3 className="text-xl font-bold mb-3">Savings Goals</h3>
              <p className="text-gray-600 leading-relaxed">Set and achieve your financial goals</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer - Updated with black background */}
      <footer className="bg-black text-white py-12 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 sm:mb-0">
              <img src={logo} alt="FinFlow Logo" className="h-8 w-auto" />
              <span className="text-xl font-bold text-white">
                
              </span>
            </div>
            <div className="text-gray-400 text-sm">
              © {new Date().getFullYear()} FinFlow. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;