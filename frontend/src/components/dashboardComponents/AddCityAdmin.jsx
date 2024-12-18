import React from "react";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import toast from "react-hot-toast";
import { IoClose } from "react-icons/io5";

import FormWrapper from "../formComponents/FormWrapper";
import Input from "../formComponents/Input";
import { createFormData } from "../../utils/createFormData";
import { parseErrorMessage } from "../../utils/parseErrorMessage";
import { useFetchCoordinates } from "../../hooks/useFetchCoordinates";
import { addCityAdmin } from "../../api/admin";

const cityAdminSchema = z.object({
  username: z.string().nonempty("Username is required"),
  email: z.string().email("Invalid email address"),
  phoneNo: z.string().nonempty("Phone number is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  address: z.string().nonempty("Address is required"),
  city: z.string().nonempty("City is required"),
  state: z.string().nonempty("State is required"),
  pincode: z.string().nonempty("Pincode is required"),
});

function AddCityAdmin({ setAddCityAdmin }) {
  const { mutateAsync: fetchCoordinates } = useFetchCoordinates();

  const addCityAdminMutation = useMutation({
    mutationFn: addCityAdmin,
    onSuccess: () => {
      toast.success("City admin added successfully");
      setAddCityAdmin(false);
    },
    onError: (error) => {
      console.log(error);
      toast.error(parseErrorMessage(error?.response));
    },
  });

  const handleSubmit = async (data) => {
    const coordinates = await fetchCoordinates(data.pincode);
    data.coordinates = coordinates;
    const formData = createFormData(data);
    addCityAdminMutation.mutate(formData);
  };

  return (
    <div className="fixed inset-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center p-4 z-50 overflow-y-auto">
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-2xl overflow-hidden transform transition-all duration-300 ease-in-out my-8">
        <div className="bg-gradient-to-r from-green-500 to-blue-500 p-4 sm:p-6 flex justify-between items-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            Add City Admin
          </h2>
          <button
            className="text-white hover:text-gray-200 transition duration-150 ease-in-out"
            onClick={() => setAddCityAdmin(false)}
          >
            <IoClose className="text-2xl sm:text-3xl" />
          </button>
        </div>
        <div className="p-4 sm:p-6 md:p-8 max-h-[calc(100vh-200px)] overflow-y-auto">
          <FormWrapper onSubmit={handleSubmit} schema={cityAdminSchema}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {[
                { name: "username", label: "Username", type: "text" },
                { name: "email", label: "Email", type: "email" },
                { name: "phoneNo", label: "Phone Number", type: "tel" },
                { name: "password", label: "Password", type: "password" },
                { name: "address", label: "Address", type: "text" },
                { name: "city", label: "City", type: "text" },
                { name: "state", label: "State", type: "text" },
                { name: "pincode", label: "Pincode", type: "text" },
              ].map((field) => (
                <div key={field.name} className="relative">
                  <Input
                    name={field.name}
                    label={field.label}
                    type={field.type}
                    // className=" px-4 py-2 text-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white border border-gray-300 "
                  />
                </div>
              ))}
            </div>
            <button
              type="submit"
              className=" w-full bg-green-500 text-white px-6 py-3 rounded-xl text-base sm:text-lg font-medium transition duration-300 ease-in-out hover:bg-green-600"
            >
              Add City Admin
            </button>
          </FormWrapper>
        </div>
      </div>
    </div>
  );
}

export default AddCityAdmin;