import React from 'react'
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import toast from "react-hot-toast";
import { IoClose } from "react-icons/io5";

import FormWrapper from '../formComponents/FormWrapper'
import FileInput from '../formComponents/FileInput'
import Input from '../formComponents/Input'
import Select from '../formComponents/Select'
import { createFormData } from '../../utils/createFormData';
import { addPost, updatePost } from '../../api/foodPosts';

const addPostSchema = z.object({
  images:z.instanceof(FileList).optional(),
  title: z.string().nonempty("Title is required"),
  description: z.string().nonempty("Description is required"),
  quantity: z.string().nonempty("Quantity is required"),
  foodType: z.string().nonempty("Food Type is required"),
  expiryDate: z.string().nonempty("Expiry Date is required"),
  pickUpDate: z.string().nonempty("Pickup Date is required"),
});


function FoodPost({setIsOpen,post}) {
  const isEditMode = !!post;

  const addPostMutation = useMutation({
    mutationFn:addPost,
    onSuccess:() => {
      toast.success("Post added successfully")
    },
    onError:(error) => {
      console.log(error)
    }
  })

  const editPostMutation = useMutation({
    mutationFn:updatePost,
    onSuccess:() => {
      toast.success("Post updated successfully")
    },
    onError:(error) => {
      console.log(error)
    }
  })

  const handleSubmit = (data) => {
    const formData = createFormData(data);
    if(isEditMode){
      editPostMutation.mutate(post._id,formData);
    } else {
      addPostMutation.mutate(formData);
    }
  }
  return (
    <div className=" w-full h-full absolute top-0 bg-gray-400/80 flex justify-center items-center">
        <div className=" w-[60%] flex flex-wrap justify-center p-8 rounded-lg bg-white">
            <div className="basis-full flex justify-end">
                <button
                    className=" text-xl text-black " 
                    onClick={() => setIsOpen(false)}
                >
                    <IoClose className=" text-2xl"/>
                </button>
            </div>
            <div>
              <FormWrapper
                onSubmit={handleSubmit}
                schema={addPostSchema}
                defaultValues={post || {}}
              >
                <div>
                    <FileInput
                        name="images"
                        label="Images"
                        multiple={true}
                        previewStyle='post'
                        initialFiles={post?.images || []}
                    />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <Input name="title" label="Title"/>
                    <Input name="description" label="Description"/>
                    <Input name="quantity" label="Quantity"/>
                    <Select name="quantityUnit" label="Quantity Unit" 
                      options={[
                        { value: "kg", label: "kg" },
                        { value: "units", label: "units" },
                        { value: "litre", label: "litre" },
                        { value: "packet", label: "packet" },
                        { value: "box", label: "box" },
                        { value: "other", label: "other" },
                      ]}
                    />
                    <Select name="foodType" label="Food Type" options={[{ value: "veg", label: "Veg" },
                { value: "non-veg", label: "Non-veg" },]}/>
                    <Input name="bestBefore" label="Best Before"/>
                    <Input name="pickUpDate" label="Pickup Date"/>
                </div>
                <button
                  type="submit"
                  className="w-full bg-green-600 text-white px-6 py-3 rounded-md text-base sm:text-lg font-medium transition duration-300 ease-in-out hover:bg-green-700 shadow-md hover:shadow-lg"
                >
                  {isEditMode ? "Update Post" : "Add Post"}
                </button>
              </FormWrapper>
            </div>
        </div>
    </div>
  )
}

export default FoodPost
