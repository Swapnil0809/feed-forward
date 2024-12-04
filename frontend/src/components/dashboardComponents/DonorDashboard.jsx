import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import { fetchDonorFoodPosts, deletePost } from '../../api/foodPosts';
import { fetchFoodRequests } from '../../api/foodRequest';
import FoodPostModal from './FoodPostModal';

const DonorDashboard = () => {

  const [isOpen,setIsOpen] = useState(false)
  const [editingPost, setEditingPost] = useState(null);

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

  const deletePostMutation = useMutation({
    mutationFn:deletePost,
    onSuccess:() => {
      toast.success("Post deleted successfully")
    },
    onError:(error) => {
      console.log(error)
    }
  })
 

  return (
    <>
      <div className=' max-w-7xl max-h-[50vh] mx-auto flex gap-4 p-5 rounded-lg border-black border-[2px]'>
        <div className='w-[50%] max-h-[90%] p-5 flex flex-col gap-5 rounded-lg border-black border-[2px]'>
          <h1 className=' text-2xl font-bold text-gray-900'>Food Posts</h1>
          <button 
            className='w-[8em] p-2 rounded-lg bg-green-500 text-white'
            onClick={() => {
              setEditingPost(null)
              setIsOpen(true)
              }
            }
          >
            add
          </button>
          <div className=' flex flex-col gap-5 overflow-y-auto'>
            {
              foodPosts && foodPosts.map((post) => (
                <div key={post._id} className=' p-5 border-black border-[2px]'>
                  <div>
                    {
                      post.images.length > 0 && (
                        post.images.map((image) => (
                          <img key={post._id} src={image} alt="image" />
                        ))
                      )
                    }
                  </div>
                  <h3>{post.title}</h3>
                  <p>{post.description}</p>
                  <p>{post.quantity}</p>
                  <p>{post.foodType}</p>
                  <p>{post.location.properties.address}</p>
                  <p>{post.status}</p>
                  <div>
                  <button
                    className="mt-2 p-2 rounded-lg bg-blue-500 text-white"
                    onClick={() => {
                      setEditingPost(post); 
                      setIsOpen(true);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="mt-2 p-2 rounded-lg bg-red-500 text-white"
                    onClick={() => {
                      deletePostMutation.mutate(post._id);}}
                  >
                    delete
                  </button>
                  </div>
                </div>
              ))
            }
          </div>
        </div>
        <div className='w-[50%] max-h-[90%] p-5 flex flex-col gap-5 rounded-lg border-black border-[2px]'>
          <h1 className=' text-2xl font-bold text-gray-900'>Recent Food Requests</h1>
          <div className=' flex flex-col gap-5 overflow-y-auto'>
            {
              foodRequests && foodRequests.map((request) => (
                <div key={request._id} className=' flex justify-evenly items-center gap-2 p-2 border-black border-[2px]'>
                  <div>
                    <h3>{request.title}</h3>
                    <p>{request.description}</p>
                    <p>{request.quantity}</p>
                    <p>{request.foodType}</p>
                    <p>{request.location.properties.address}</p>
                  </div>
                  <button 
                    className='w-[8vw] h-[5vh] p-2 rounded-lg bg-green-500 text-white'
                  >
                    donate
                  </button>
                </div>
              ))
            }
          </div>
        </div>
      </div>
      {isOpen && (
        <FoodPostModal
          setIsOpen={setIsOpen}
          post={editingPost} // Pass post to edit or null
        />
      )}
    </>
  );
};

export default DonorDashboard;

