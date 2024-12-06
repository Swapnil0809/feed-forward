import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { deletePost } from "../../api/foodPosts";
import FoodPostModal from "./FoodPostModal";

const FoodPost = ({ foodPosts, userRole }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);

  const deletePostMutation = useMutation({
    mutationFn: deletePost,
    onSuccess: () => {
      toast.success("Post deleted successfully");
    },
    onError: (error) => {
      console.log(error);
    },
  });

  return (
    <>
      <div className="w-[50%] max-h-[90%] p-5 flex flex-col gap-5 rounded-lg border-black border-[2px]">
        <h1 className=" text-2xl font-bold text-gray-900">Food Posts</h1>
        {userRole === "Donor" && (
          <button
            className="w-[8em] p-2 rounded-lg bg-green-500 text-white"
            onClick={() => {
              setEditingPost(null);
              setIsOpen(true);
            }}
          >
            add
          </button>
        )}
        <div className=" flex flex-col gap-5 overflow-y-auto">
          {foodPosts &&
            foodPosts.map((post) => (
              <div key={post._id} className=" p-5 border-black border-[2px]">
                <div>
                  {post.images.length > 0 &&
                    post.images.map((image, index) => (
                      <img key={index} src={image} alt="image" />
                    ))}
                </div>
                <h3>{post.title}</h3>
                <p>{post.description}</p>
                <p>{post.quantity}</p>
                <p>{post.foodType}</p>
                <p>{post.location.properties.address}</p>
                <p>{post.status}</p>
                {userRole === "Donor" && (
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
                        deletePostMutation.mutate(post._id);
                      }}
                    >
                      delete
                    </button>
                  </div>
                )}
                {userRole === "Recipient" && (
                  <button className="mt-2 p-2 rounded-lg bg-green-500 text-white">
                    request
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
