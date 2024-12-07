import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { deleteFoodRequest } from "../../api/foodRequest";
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
    },
  });

  return (
    <>
      <div className="w-[50%] max-h-[90%] p-5 flex flex-col gap-5 rounded-lg border-black border-[2px]">
        <h1 className=" text-2xl font-bold text-gray-900">Food Requests</h1>
        {userRole === "Recipient" && (
          <button
            className="w-[8em] p-2 rounded-lg bg-green-500 text-white"
            onClick={() => {
              setEditingRequest(null);
              setIsOpen(true);
            }}
          >
            add
          </button>
        )}
        <div className=" flex flex-col gap-5 overflow-y-auto">
          {foodRequests &&
            foodRequests.map((request) => (
              <div key={request._id} className=" p-5 border-black border-[2px]">
                <h3>{request.title}</h3>
                <p>{request.description}</p>
                <p>{request.quantity}</p>
                <p>{request.foodType}</p>
                <p>{request.location.properties.address}</p>
                <p>{request.status}</p>
                {userRole === "Recipient" && (
                  <div>
                    <button
                      className="mt-2 p-2 rounded-lg bg-blue-500 text-white"
                      onClick={() => {
                        setEditingRequest(request);
                        setIsOpen(true);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="mt-2 p-2 rounded-lg bg-red-500 text-white"
                      onClick={() => {
                        deleteRequestMutation.mutate(request._id);
                      }}
                    >
                      delete
                    </button>
                  </div>
                )}
                {userRole === "Donor" && (
                  <button className="mt-2 p-2 rounded-lg bg-green-500 text-white">
                    donate
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
