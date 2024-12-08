import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { FiEdit2, FiTrash2, FiPlusCircle, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { MdFastfood } from "react-icons/md";

import { deletePost } from "../../api/foodPosts";
import FoodPostModal from "./FoodPostModal";

const FoodPost = ({ foodPosts, userRole }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState({});

  const deletePostMutation = useMutation({
    mutationFn: deletePost,
    onSuccess: () => {
      toast.success("Post deleted successfully");
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const nextImage = (postId) => {
    setCurrentImageIndex(prev => ({
      ...prev,
      [postId]: (prev[postId] + 1) % foodPosts.find(post => post._id === postId).images.length
    }));
  };

  const prevImage = (postId) => {
    setCurrentImageIndex(prev => ({
      ...prev,
      [postId]: (prev[postId] - 1 + foodPosts.find(post => post._id === postId).images.length) % foodPosts.find(post => post._id === postId).images.length
    }));
  };

  return (
    <>
      <div className="w-full max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
          <MdFastfood className="mr-2 text-green-500" />
          Food Posts
        </h1>
        {userRole === "Donor" && (
          <button
            className="w-full mb-6 py-3 px-6 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75 transition duration-300 ease-in-out flex items-center justify-center"
            onClick={() => {
              setEditingPost(null);
              setIsOpen(true);
            }}
          >
            <FiPlusCircle className="mr-2" />
            Add New Post
          </button>
        )}
        <div className="space-y-6 overflow-y-auto max-h-[70vh] pr-2">
          {foodPosts &&
            foodPosts.map((post) => (
              <div key={post._id} className="bg-gray-50 p-6 rounded-lg shadow-md hover:shadow-xl transition duration-300 ease-in-out">
                <div className="relative mb-4 h-64 overflow-hidden rounded-lg">
                  {post.images.length > 0 && (
                    <>
                      <img 
                        src={post.images[currentImageIndex[post._id] || 0]} 
                        alt={`Food ${currentImageIndex[post._id] || 0 + 1}`} 
                        className="w-full h-full object-cover"
                      />
                      {post.images.length > 1 && (
                        <>
                          <button 
                            onClick={() => prevImage(post._id)} 
                            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-75 transition duration-300"
                          >
                            <FiChevronLeft size={24} />
                          </button>
                          <button 
                            onClick={() => nextImage(post._id)} 
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-75 transition duration-300"
                          >
                            <FiChevronRight size={24} />
                          </button>
                        </>
                      )}
                    </>
                  )}
                </div>
                <h3 className="text-2xl font-semibold text-gray-800 mb-2">{post.title}</h3>
                <p className="text-gray-600 mb-4">{post.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    Quantity: {post.quantity}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    post.foodType.toLowerCase() === 'veg' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {post.foodType}
                  </span>
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                    {post.status}
                  </span>
                </div>
                <p className="text-gray-600 mb-4 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  {post.location.properties.address}
                </p>
                {userRole === "Donor" && (
                  <div className="flex space-x-2">
                    <button
                      className="flex-1 py-2 px-4 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 transition duration-300 ease-in-out flex items-center justify-center"
                      onClick={() => {
                        setEditingPost(post);
                        setIsOpen(true);
                      }}
                    >
                      <FiEdit2 className="mr-2" />
                      Edit
                    </button>
                    <button
                      className="flex-1 py-2 px-4 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75 transition duration-300 ease-in-out flex items-center justify-center"
                      onClick={() => {
                        deletePostMutation.mutate(post._id);
                      }}
                    >
                      <FiTrash2 className="mr-2" />
                      Delete
                    </button>
                  </div>
                )}
                {userRole === "Recipient" && (
                  <button className="w-full mt-4 py-2 px-4 bg-green-500 text-white font-medium rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75 transition duration-300 ease-in-out">
                    Request
                  </button>
                )}
              </div>
            ))}
        </div>
      </div>
      {isOpen && <FoodPostModal setIsOpen={setIsOpen} post={editingPost} />}
    </>
  );
};

export default FoodPost;