import React from 'react';
import { useQuery } from '@tanstack/react-query';

import { fetchDonorFoodPosts } from '../../api/foodPosts';
import { fetchFoodRequests } from '../../api/foodRequest';
import FoodPost from './FoodPost';
import FoodRequest from './FoodRequest';

const DonorDashboard = () => {
  const { data: foodPosts } = useQuery({
    queryKey: ["donorFoodPosts"],
    queryFn: fetchDonorFoodPosts,
    enabled: true
  });

  const { data: foodRequests } = useQuery({
    queryKey: ["foodRequests"],
    queryFn: fetchFoodRequests,
    enabled: true
  });

  return (
    <div className="bg-gradient-to-r from-green-100 via-teal-100 to-blue-100 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
       <h1 className="text-4xl font-bold text-center text-gray-800 mb-12 "></h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-xl p-6 ">
            <h2 className="text-2xl font-bold text-gray-700 mb-6">Your Food Posts</h2>
            <div className="overflow-hidden rounded-lg border border-gray-200">
              <FoodPost foodPosts={foodPosts} userRole="Donor" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-xl p-6">
            <h2 className="text-2xl font-bold text-gray-700 mb-6">Food Requests</h2>
            <div className="overflow-hidden rounded-lg border border-gray-200">
              <FoodRequest foodRequests={foodRequests} userRole="Donor" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonorDashboard;