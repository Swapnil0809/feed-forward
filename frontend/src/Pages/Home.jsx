import React from 'react';
import { useNavigate } from 'react-router-dom';
import HeroImg from "../assets/Home/food-delivery-boy.png";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-r from-green-100 via-teal-100 to-blue-100 text-gray-900 flex flex-col">
      {/* Header Section */}
      <header className="py-4 px-4 sm:px-6 lg:px-8 bg-white/80 shadow-md z-10 relative">
        <nav className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <span className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-green-600 tracking-wide">FeedForward</span>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-4">
            <button
              className="bg-green-500 text-white px-3 py-2 sm:px-4 sm:py-2 lg:px-5 lg:py-3 text-sm sm:text-base rounded-lg shadow-lg hover:bg-green-600 hover:scale-105 transition-all duration-300"
              onClick={() => navigate("/login")}
            >
              Log in
            </button>
            <button
              className="hidden sm:block bg-green-500 text-white px-3 py-2 sm:px-4 sm:py-2 lg:px-5 lg:py-3 text-sm sm:text-base rounded-lg shadow-lg hover:bg-green-600 hover:scale-105 transition-all duration-300"
              onClick={() => navigate("/signup")}
            >
              Sign up
            </button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className=" flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-24 relative z-10 pt-5">
        <div className="max-w-7xl w-full flex lg:flex-row items-center justify-between space-y-8 lg:space-y-0 lg:space-x-8 flex-col-reverse pb-8">
          {/* Left Content */}
          <div className="lg:w-1/2 space-y-4 sm:space-y-6 text-center lg:text-left ">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold leading-tight">
              <span className="text-gray-800">Save Food,</span><br />
              <span className="text-green-600 animate-pulse">Save Life</span>
            </h1>
            <p className="mt-2 sm:mt-4 text-base sm:text-lg lg:text-xl text-gray-800 max-w-prose mx-auto lg:mx-0">
              Join our mission to reduce food waste and help those in need.
              Together, we can make a difference one meal at a time.
            </p>
            <button
              className="mt-4 sm:mt-6 bg-green-500 text-white px-6 py-3 text-base sm:text-lg rounded-lg shadow-lg hover:bg-green-600 hover:scale-105 transition-all duration-300"
              onClick={() => navigate("/signup")}
            >
              Get Started
            </button>
          </div>

          {/* Right Image Section */}
          <div className="lg:w-1/2 flex justify-center">
            <img
              src={HeroImg}
              alt="Food Delivery"
              className="max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl h-auto transform transition-transform duration-500 hover:scale-105 ml-12 "
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;