import React from 'react';
import { useNavigate } from 'react-router-dom';
import HeroImg from "../assets/Home/food-delivery-boy.png";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-r from-green-100 via-teal-100 to-blue-100 text-gray-900 flex flex-col">
      {/* Header Section */}
      <header className="py-4 px-4 sm:px-6 lg:px-8 bg-white/80 shadow-md rounded-b-2xl z-10 relative">
        <nav className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <div className="flex items-center">
            <span className="text-2xl sm:text-3xl font-extrabold text-green-600 tracking-wide">FeedForward</span>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-4">
            <button
              className="bg-green-500 text-white px-3 py-2 sm:px-5 sm:py-3 text-sm sm:text-base rounded-lg shadow-lg hover:bg-green-600 hover:scale-105 transition-all duration-300"
              onClick={() => navigate("/login")}
            >
              Log in
            </button>
            <button
              className="bg-green-500 text-white px-3 py-2 sm:px-5 sm:py-3 text-sm sm:text-base rounded-lg shadow-lg hover:bg-green-600 hover:scale-105 transition-all duration-300"
              onClick={() => navigate("/signup")}
            >
              Sign up
            </button>
          </div>
        </nav>
      </header>
      {/* Hero Section */}
      <main className="flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-24 relative z-10">
        <div className="max-w-7xl w-full flex flex-col md:flex-row items-center justify-between space-y-8 md:space-y-0 md:space-x-8">
          {/* Left Content */}
          <div className="md:w-1/2 space-y-6 text-center md:text-left">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight">
              <span className="text-gray-800">Save Food,</span><br />
              <span className="text-green-600 animate-pulse">Save Life</span>
            </h1>
            <p className="mt-4 text-base sm:text-lg md:text-xl text-gray-700 max-w-prose">
              Join our mission to reduce food waste and help those in need.
              Together, we can make a difference one meal at a time.
            </p>
            <button
              className="mt-6 bg-green-500 text-white px-6 py-3 text-lg rounded-lg shadow-lg hover:bg-green-600 hover:scale-105 transition-all duration-300"
              onClick={() => navigate("/signup")}
            >
              Get Started
            </button>
          </div>

          {/* Right Image Section */}
          <div className="md:w-1/2 flex justify-center">
            <img
              src={HeroImg}
              alt="Food Delivery"
              className="max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg h-auto transform transition-transform duration-500 hover:scale-105"
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;

