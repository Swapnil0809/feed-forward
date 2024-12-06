import React from 'react';
import { useQuery} from '@tanstack/react-query';

import { fetchRecipientFoodRequests } from '../../api/foodRequest';
import { fetchFoodPosts } from '../../api/foodPosts';
import FoodRequest from './FoodRequest';
import FoodPost from './FoodPost';

const RecipientDashboard = () => {
  
  const {data:foodRequests} = useQuery({
    queryKey: ["recipientFoodRequests"],
    queryFn: fetchRecipientFoodRequests,
    enabled: true
  })

  const {data:foodPosts} = useQuery({   
    queryKey: ["foodPosts"],
    queryFn: fetchFoodPosts,
    enabled: true
  })

 
  return (
    <>
      <div className=' max-w-7xl max-h-[50vh] mx-auto flex gap-4 p-5 rounded-lg border-black border-[2px]'>
        <FoodRequest foodRequests={foodRequests} userRole="Recipient"/>
        <FoodPost foodPosts={foodPosts} userRole="Recipient"/>
      </div>
    </>
  );
};

export default RecipientDashboard;

