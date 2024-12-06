import React from 'react';
import { useQuery } from '@tanstack/react-query';

import { fetchDonorFoodPosts } from '../../api/foodPosts';
import { fetchFoodRequests } from '../../api/foodRequest';
import FoodPost from './FoodPost';
import FoodRequest from './FoodRequest';

const DonorDashboard = () => {


  const {data:foodPosts} = useQuery({
    queryKey: ["donorFoodPosts"],
    queryFn: fetchDonorFoodPosts,
    enabled: true
  })

  const {data:foodRequests} = useQuery({
    queryKey: ["foodRequests"],
    queryFn: fetchFoodRequests,
    enabled: true
  })

 

  return (
    <>
      <div className=' max-w-7xl max-h-[50vh] mx-auto flex gap-4 p-5 rounded-lg border-black border-[2px]'>
        <FoodPost foodPosts={foodPosts} userRole="Donor"/>
        <FoodRequest foodRequests={foodRequests} userRole="Donor"/>
      </div>
    </>
  );
};

export default DonorDashboard;

