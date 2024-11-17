import React from 'react'
import { useNavigate } from 'react-router-dom';
const Home = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 text-gray-900 flex flex-col">
    {/* Header Section */}
    <header className="py-4 px-4 sm:px-6 lg:px-8 bg-white shadow-sm">
      <nav className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <span className="text-2xl font-bold text-gray-900">FeedForward</span>
        </div>
        <div className="flex items-center space-x-2 sm:space-x-4">
          <button className="text-gray-700 hover:text-gray-1000 hover:bg-gray-300 px-3 py-2 sm:px-4 sm:py-2 rounded-md"
          onClick={() => navigate("/Login")}>
            Log in
          </button>
          <button className="bg-bgc text-gray-700  hover:text-gray-1000 hover:bg-gray-300 px-3 py-2 sm:px-4 sm:py-2 rounded-md hover:bg-hovr">
            Sign up
          </button>
        </div>
      </nav>
    </header>

    {/* Hero Section */}
    <main className="flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-7xl w-full flex flex-col md:flex-row items-center justify-between">
        {/* Right Image Section for Small Screens */}
        <div className="md:w-1/3 h-70 mt-1 md:mt-0 order-1 md:order-2 flex justify-center ">
          <img
            src="src\images\food-delivery-boy.png"
            alt="Food Wastage"
            className="max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg h-auto ml-10"
          />
        </div>

        {/* Left Content */}
        <div className="md:w-1/2 space-y-6 text-center md:text-left order-2 md:order-1">
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold leading-tight mt--10">
            Save Food,
            <span className="block text-green-500 ">Save Lives</span>
          </h1>
          <p className="mt-3 text-lg text-gray-600 sm:mt-5 sm:text-xl max-w-prose">
            Join our mission to reduce food waste and help those in need. 
            Together, we can make a difference one meal at a time.
          </p>
          <button className="bg-bgc text-white px-6 py-3 sm:px-8 sm:py-4 rounded-full text-lg hover:bg-hovr">
            Get Started
          </button>
        </div>
      </div>
    </main>

    {/* Footer Section */}
    <footer className="py-6 px-4 sm:px-6 lg:px-8 bg-gray-100">
      <div className="max-w-7xl mx-auto text-center text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} FeedForward. All rights reserved.
      </div>
    </footer>
  </div>
  )
}

export default Home
