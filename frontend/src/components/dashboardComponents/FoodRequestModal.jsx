import React from 'react'
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import toast from "react-hot-toast";
import { IoClose } from "react-icons/io5";

import FormWrapper from '../formComponents/FormWrapper'
import Input from '../formComponents/Input'
import Select from '../formComponents/Select'
import { createFormData } from '../../utils/createFormData';
import { addFoodRequest, updateFoodRequest } from '../../api/foodRequest';

const requestSchema = z.object({
    title: z.string().nonempty("Title is required"),
    description: z.string().nonempty("Description is required"),
    quantity: z.preprocess(
      (val) => (typeof val === "string" ? parseFloat(val) : val),
      z.number().min(1, "Quantity must be at least 1")
    ),
    quantityUnit: z.string().nonempty("Quantity unit is required"),
    foodType: z.string().nonempty("Food Type is required"),
    requiredBy:z.preprocess((arg) => {
      // Ensure the date is parsed correctly
      return typeof arg === "string" ? new Date(arg) : arg;
    }, z.date().min(new Date(), "Best Before must be in the future")),
  });
  

function FoodRequestModal({setIsOpen,request}) {
    const isEditMode = !!request;

    const addRequestMutation = useMutation({
        mutationFn:addFoodRequest,
        onSuccess:() => {
            toast.success("Request added successfully")
            setIsOpen(false)
          },
          onError:(error) => {
            console.log(error)
          }
    })

    const editRequestMutation = useMutation({
        mutationFn:updateFoodRequest,
        onSuccess:() => {
            toast.success("Request updated successfully")
            setIsOpen(false)
          },
          onError:(error) => {
            console.log(error)
          }
    })

    const handleSubmit =async (data) => {
        console.log(data)
        const formData = createFormData(data);
        if(isEditMode){
            editRequestMutation.mutate({ id: request._id, formData });
        } else {
            addRequestMutation.mutate(formData);
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
                schema={requestSchema}
                defaultValues={request || {}}
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <Input name="title" label="Title"/>
                    <Input name="description" label="Description"/>
                    <Input name="quantity" label="Quantity" type="number"/>
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
                    <Input name="requiredBy" label="Required By" type='date'/>
                </div>
                <button
                  type="submit"
                  className="w-full bg-green-600 text-white px-6 py-3 rounded-md text-base sm:text-lg font-medium transition duration-300 ease-in-out hover:bg-green-700 shadow-md hover:shadow-lg"
                >
                  {isEditMode ? "Update Request" : "Add Request"}
                </button>
              </FormWrapper>
            </div>
        </div>
    </div>
  )
}

export default FoodRequestModal
