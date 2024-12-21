import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import toast from "react-hot-toast";
import { IoClose } from "react-icons/io5";
import BeatLoader from "react-spinners/BeatLoader";

import FormWrapper from "../formComponents/FormWrapper";
import FileInput from "../formComponents/FileInput";
import Input from "../formComponents/Input";
import Select from "../formComponents/Select";
import Checkbox from "../formComponents/CheckBox";
import { postSchema } from "../../utils/validations";
import { useFetchCoordinates } from "../../hooks/useFetchCoordinates";
import { createFormData } from "../../utils/createFormData";
import { parseErrorMessage } from "../../utils/parseErrorMessage";
import { addPost, updatePost } from "../../api/foodPosts";
import { set } from "react-hook-form";

function FoodPostModal({ setIsOpen, post }) {
  const isEditMode = !!post;
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  const { mutateAsync: fetchCoordinates } = useFetchCoordinates();

  const addPostMutation = useMutation({
    mutationFn: addPost,
    onSuccess: () => {
      setIsLoading(false);
      queryClient.invalidateQueries(["donorFoodPosts"]);
      toast.success("Post added successfully");
      setIsOpen(false);
    },
    onError: (error) => {
      setIsLoading(false);
      console.log(error);
      toast.error(parseErrorMessage(error?.response));
    },
  });

  const editPostMutation = useMutation({
    mutationFn: updatePost,
    onSuccess: () => {
      setIsLoading(false);
      queryClient.invalidateQueries(["donorFoodPosts"]);
      toast.success("Post updated successfully");
      setIsOpen(false);
    },
    onError: (error) => {
      setIsLoading(false);
      console.log(error);
      toast.error(parseErrorMessage(error?.response));
    },
  });

  const handleSubmit = async (data) => {
    console.log(data);
    setIsLoading(true);
    if (!data.useUserLocation) {
      const coordinates = await fetchCoordinates(data.pincode);
      data.coordinates = coordinates;
    }
    const formData = createFormData(data);
    for (const [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }
    if (isEditMode) {
      editPostMutation.mutate({ id: post._id, formData });
    } else {
      addPostMutation.mutate(formData);
    }
  };

  return (
    <div className="fixed inset-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center py-4 z-50 overflow-y-auto">
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-2xl overflow-hidden transform transition-all duration-300 ease-in-out my-8">
        <div className="bg-gradient-to-r from-green-400 to-blue-500 p-4 sm:p-6 flex justify-between items-center">
          <h2 className="text-xl sm:text-2xl font-bold text-white">
            {isEditMode ? "Edit Food Post" : "Add Food Post"}
          </h2>
          <button
            className="text-white hover:text-gray-200 transition duration-150 ease-in-out"
            onClick={() => setIsOpen(false)}
          >
            <IoClose className="text-2xl sm:text-3xl" />
          </button>
        </div>
        <div className="p-4 sm:p-6 md:p-8 max-h-[calc(100vh-200px)] overflow-y-auto">
          <FormWrapper
            onSubmit={handleSubmit}
            schema={postSchema}
            defaultValues={post || {}}
          >
            <div className="mb-6">
              <FileInput
                name="images"
                label="Images"
                multiple={true}
                previewStyle="post"
                initialFiles={post?.images || []}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              <Input name="title" label="Title" />
              <Input name="description" label="Description" />
              <Input name="quantity" label="Quantity" type="number" />
              <Select
                name="quantityUnit"
                label="Quantity Unit"
                options={[
                  { value: "kg", label: "kg" },
                  { value: "units", label: "units" },
                  { value: "litre", label: "litre" },
                  { value: "packet", label: "packet" },
                  { value: "box", label: "box" },
                  { value: "other", label: "other" },
                ]}
              />
              <Select
                name="foodType"
                label="Food Type"
                options={[
                  { value: "veg", label: "Veg" },
                  { value: "non-veg", label: "Non-veg" },
                ]}
              />
              <Input name="bestBefore" label="Best Before" type="date" />
              <div className="col-span-full">
                <Checkbox
                  name="useUserLocation"
                  label="Use Your Location"
                  defaultValue={false}
                  className="flex items-center space-x-2 text-sm sm:text-base"
                />
              </div>
              <Input name="address" label="Address" />
              <Input name="pincode" label="Pincode" />
            </div>
            <button
              type="submit"
              className="mt-8 w-full bg-green-500 text-white px-6 py-3 rounded-md text-base sm:text-lg font-medium transition duration-300 ease-in-out hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
            >
              {isLoading ? (
                <BeatLoader color="#fff" size={8} />
              ) : isEditMode ? (
                "Update Post"
              ) : (
                "Add Post"
              )}
            </button>
          </FormWrapper>
        </div>
      </div>
    </div>
  );
}

export default FoodPostModal;
