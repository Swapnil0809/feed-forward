import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { deleteFoodRequest,fulfillFoodRequest } from "../../api/foodRequest";
import { parseErrorMessage } from "../../utils/parseErrorMessage";
import FoodRequestModal from "./FoodRequestModal";

const FoodRequest = ({ foodRequests, userRole }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [editingRequest, setEditingRequest] = useState(null);

  const deleteRequestMutation = useMutation({
    mutationFn: deleteFoodRequest,
    onSuccess: () => {
      toast.success("Request deleted successfully");
    },
    onError: (error) => {
      console.log(error);
      toast.error(parseErrorMessage(error?.response));
    },
  });

  const fulfillRequestMutation = useMutation({
    mutationFn: fulfillFoodRequest,
    onSuccess: () => {
      toast.success("Donation is now in progress");
    },
    onError: (error) => {
      console.log(error);
      toast.error(parseErrorMessage(error?.response));
    },
  })

  return (
    <>
      <div className="w-full max-w-4xl mx-auto p-6 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Food Requests</h1>
        {userRole === "Recipient" && (
          <button
            className="w-full mb-6 py-3 px-6 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:from-green-500 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 transition duration-300 ease-in-out transform hover:-translate-y-1"
            onClick={() => {
              setEditingRequest(null);
              setIsOpen(true);
            }}
          >
            Add New Request
          </button>
        )}
        <div className="space-y-6 overflow-y-auto max-h-[70vh] pr-2">
          {foodRequests &&
            foodRequests.map((request) => (
              <div key={request._id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition duration-300 ease-in-out">
                <h3 className="text-2xl font-semibold text-gray-800 mb-2">{request.title}</h3>
                <p className="text-gray-600 mb-4">{request.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    Quantity: {request.quantity}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    request.foodType.toLowerCase() === 'veg' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {request.foodType}
                  </span>
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                    {request.status}
                  </span>
                </div>
                <p className="text-gray-600 mb-4 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  {request.location.properties.address}
                </p>
                {userRole === "Recipient" && (
                  <div className="flex space-x-2">
                    <button
                      className="flex-1 py-2 px-4 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 transition duration-300 ease-in-out"
                      onClick={() => {
                        setEditingRequest(request);
                        setIsOpen(true);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="flex-1 py-2 px-4 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75 transition duration-300 ease-in-out"
                      onClick={() => {
                        deleteRequestMutation.mutate(request._id);
                      }}
                    >
                      Delete
                    </button>
                  </div>
                )}
                {userRole === "Donor" && (
                  <button 
                    className="w-full mt-4 py-2 px-4 bg-green-500 text-white font-medium rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75 transition duration-300 ease-in-out"
                    onClick={() => fulfillRequestMutation.mutate(request._id)}
                  >
                    Donate
                  </button>
                )}
              </div>
            ))}
        </div>
      </div>
      {isOpen && (
        <FoodRequestModal setIsOpen={setIsOpen} post={editingRequest} />
      )}
    </>
  );
};

export default FoodRequest;