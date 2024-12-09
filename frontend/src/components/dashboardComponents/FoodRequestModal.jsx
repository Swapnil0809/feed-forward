import React from 'react'
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import toast from "react-hot-toast";
import { IoClose } from "react-icons/io5";

import FormWrapper from '../formComponents/FormWrapper'
import Input from '../formComponents/Input'
import Select from '../formComponents/Select'
import { createFormData } from '../../utils/createFormData';
import { parseErrorMessage } from '../../utils/parseErrorMessage';
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
            toast.error(parseErrorMessage(error?.response));
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
            toast.error(parseErrorMessage(error?.response));
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
    <div className="fixed inset-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center backdrop-blur-sm transition-opacity duration-300">
        <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-300 ease-in-out">
            <div className="bg-gradient-to-r from-green-400 to-blue-500 p-6 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white">
                    {isEditMode ? "Edit Food Request" : "Add Food Request"}
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
                schema={requestSchema}
                defaultValues={request || {}}
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
                    <Select name="foodType" label="Food Type" options={[
                      { value: "veg", label: "Veg" },
                      { value: "non-veg", label: "Non-veg" },
                    ]}/>
                    <Input name="requiredBy" label="Required By" type='date'/>
                </div>
                <button
                  type="submit"
                  className="mt-8 w-full bg-green-500 text-white px-6 py-3 rounded-md text-lg font-medium transition duration-300 ease-in-out hover:bg-green-600"
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