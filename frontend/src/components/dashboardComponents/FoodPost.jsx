import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { FiEdit2, FiTrash2, FiPlusCircle } from "react-icons/fi";
import { MdFastfood } from "react-icons/md";
import BeatLoader from "react-spinners/BeatLoader";

import { deletePost, requestFood } from "../../api/foodPosts";
import { parseErrorMessage } from "../../utils/parseErrorMessage";
import FoodPostModal from "./FoodPostModal";
import ImageSlider from "./ImageSlider";

const FoodPost = ({ foodPosts, userRole }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);

  const queryClient = useQueryClient();

  const deletePostMutation = useMutation({
    mutationFn: deletePost,
    onSuccess: () => {
      toast.success("Post deleted successfully");
      // Invalidate the donorFoodPosts query to refetch data
      queryClient.invalidateQueries(["donorFoodPosts"]);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const requestFoodMutation = useMutation({
    mutationFn: requestFood,
    onSuccess: () => {
      toast.success("Request approved!, your donation is in progress");
    },
    onError: (error) => {
      console.log(error);
      toast.error(parseErrorMessage(error?.response));
    },
  });

  return (
    <>
      <div className="w-full max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg bg-gradient-to-br from-blue-50 to-green-50">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
          <MdFastfood className="mr-2 text-green-500 items-center size-9" />
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
              <div
                key={post._id}
                className="bg-gray-50 p-6 rounded-lg shadow-md hover:shadow-xl transition duration-300 ease-in-out"
              >
                <ImageSlider images={post.images} />
                <h3 className="text-2xl font-semibold text-gray-800 mb-2 ">
                  {post.title}
                </h3>
                <p className="text-gray-600 mb-4">{post.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    Quantity: {post.quantity}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      post.foodType.toLowerCase() === "veg"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {post.foodType}
                  </span>
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                    {post.status}
                  </span>
                </div>
                <p className="text-gray-600 mb-4 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2 text-gray-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {post.location.properties.address}
                </p>
                {userRole === "Donor" && (
                  <div className="flex space-x-2">
                    <button
                      className="flex-1 py-2 px-4 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 flex items-center justify-center"
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
                      {deletePostMutation.isPending ? (
                        <BeatLoader color="#fff" size={8} />
                      ) : (
                        "Delete"
                      )}
                    </button>
                  </div>
                )}
                {userRole === "Recipient" && (
                  <button
                    className="w-full mt-4 py-2 px-4 bg-green-500 text-white font-medium rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75 transition duration-300 ease-in-out"
                    onClick={() => requestFoodMutation.mutate(post._id)}
                  >
                    {requestFoodMutation.isPending ? (
                      <BeatLoader color="#fff" size={8} />
                    ) : (
                      "Request Food"
                    )}
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
