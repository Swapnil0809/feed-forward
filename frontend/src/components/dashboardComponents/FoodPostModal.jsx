import React from 'react'
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import toast from "react-hot-toast";
import { IoClose } from "react-icons/io5";

import FormWrapper from '../formComponents/FormWrapper'
import FileInput from '../formComponents/FileInput'
import Input from '../formComponents/Input'
import Select from '../formComponents/Select'
import Checkbox from '../formComponents/CheckBox';
import { useFetchCoordinates } from '../../hooks/useFetchCoordinates';
import { createFormData } from '../../utils/createFormData';
import { parseErrorMessage } from '../../utils/parseErrorMessage';
import { addPost, updatePost } from '../../api/foodPosts';

const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const postSchema = z.object({
  images:z.any().optional()
    .refine(
      (files) => {
        if (!files || files.length === 0) return true;
        return files.every((file) => ACCEPTED_IMAGE_TYPES.includes(file.type));
      },
      { message: "Invalid file(s). Please choose JPEG, PNG, or WebP images only." }
    ),
  title: z.string().nonempty("Title is required"),
  description: z.string().nonempty("Description is required"),
  quantity: z.preprocess(
    (val) => (typeof val === "string" ? parseFloat(val) : val),
    z.number().min(1, "Quantity must be at least 1")
  ),
  quantityUnit: z.string().nonempty("Quantity unit is required"),
  foodType: z.string().nonempty("Food Type is required"),
  bestBefore:z.preprocess((arg) => {
    // Ensure the date is parsed correctly
    return typeof arg === "string" ? new Date(arg) : arg;
  }, z.date().min(new Date(), "Best Before must be in the future")),
  useUserLocation: z.boolean().default(false),
  address: z.string().optional(),
  pincode: z.string().optional(),
});


function FoodPostModal({setIsOpen,post}) {
  const isEditMode = !!post;

  const {mutateAsync:fetchCoordinates} = useFetchCoordinates();

  const addPostMutation = useMutation({
    mutationFn:addPost,
    onSuccess:() => {
      toast.success("Post added successfully")
      setIsOpen(false)
    },
    onError:(error) => {
      console.log(error)
      toast.error(parseErrorMessage(error?.response));
    }
  })

  const editPostMutation = useMutation({
    mutationFn:updatePost,
    onSuccess:() => {
      toast.success("Post updated successfully")
      setIsOpen(false)
    },
    onError:(error) => {
      console.log(error)
      toast.error(parseErrorMessage(error?.response));
    }
  })

  const handleSubmit =async (data) => {
    console.log(data)
    if(!data.useUserLocation){
      const coordinates = await fetchCoordinates(data.pincode);
      data.coordinates = coordinates;
    }
    const formData = createFormData(data);
    for (const [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
  }
    if(isEditMode){
      editPostMutation.mutate({ id: post._id, formData });
    } else {
      addPostMutation.mutate(formData);
    }
  }
  return (
    <div className="fixed inset-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
  <div className="w-full max-w-4xl bg-white rounded-xl shadow-2xl overflow-hidden transform transition-all duration-300 ease-in-out">
    <div className="bg-gradient-to-r from-green-400 to-blue-500 p-6 flex justify-between items-center">
      <h2 className="text-2xl font-bold text-white">
        {isEditMode ? "Edit Food Post" : "Add Food Post"}
      </h2>
      <button
        className="text-white hover:text-gray-200 transition duration-150 ease-in-out"
        onClick={() => setIsOpen(false)}
      >
        <IoClose className="text-3xl" />
      </button>
    </div>
    <div className="p-8">
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
          <Checkbox
            name="useUserLocation"
            label="Use Your Location"
            defaultValue={false}
          />
          <Input name="address" label="Address" />
          <Input name="pincode" label="Pincode" />
        </div>
        <button
          type="submit"
          className="mt-8 w-full bg-green-500 text-white px-6 py-3 rounded-md text-lg font-medium transition duration-300 ease-in-out hover:bg-green-600">
          {isEditMode ? "Update Post" : "Add Post"}
        </button>
      </FormWrapper>
    </div>
  </div>
</div>

  )
}

export default FoodPostModal
