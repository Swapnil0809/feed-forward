import React from "react";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import toast from "react-hot-toast";
import { IoClose } from "react-icons/io5";
import { FaUser, FaEnvelope, FaPhone, FaLock, FaMapMarkerAlt, FaCity, FaFlag, FaMapPin } from "react-icons/fa";

import FormWrapper from "../formComponents/FormWrapper";
import Input from "../formComponents/Input"
import { createFormData } from "../../utils/createFormData";
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
      toast.error("Failed to add city admin");
    },
  });

  const handleSubmit = async (data) => {
    console.log(data);
    const coordinates = await fetchCoordinates(data.pincode);
    data.coordinates = coordinates;
    const formData = createFormData(data);
    console.log(Array.from(formData.entries()))
    addCityAdminMutation.mutate(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm overflow-y-auto h-full w-full flex justify-center items-center ">
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-4xl m-4 p-6">
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          onClick={() => setAddCityAdmin(false)}
        >
          <IoClose className="text-2xl" />
        </button>
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center ">Add City Admin</h2>
        <FormWrapper onSubmit={handleSubmit} schema={cityAdminSchema}>
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative">
                <FaUser className="absolute top-3 left-3 text-gray-400" />
                <Input name="username" label="Username" type="text" className="pl-10 w-full px-4 py-2 text-gray-700 bg-white rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent" />
              </div>
              <div className="relative">
                <FaEnvelope className="absolute top-3 left-3 text-gray-400" />
                <Input name="email" label="Email" type="email" className="pl-10 w-full px-4 py-2 text-gray-700 bg-white rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent" />
              </div>
              <div className="relative">
                <FaPhone className="absolute top-3 left-3 text-gray-400" />
                <Input name="phoneNo" label="Phone Number" type="text" className="pl-10 w-full px-4 py-2 text-gray-700 bg-white rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent" />
              </div>
              <div className="relative">
                <FaLock className="absolute top-3 left-3 text-gray-400" />
                <Input name="password" label="Password" type="password" className="pl-10 w-full px-4 py-2 text-gray-700 bg-white rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent" />
              </div>
              <div className="relative">
                <FaMapMarkerAlt className="absolute top-3 left-3 text-gray-400" />
                <Input name="address" label="Address" className="pl-10 w-full px-4 py-2 text-gray-700 bg-white rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent" />
              </div>
              <div className="relative">
                <FaCity className="absolute top-3 left-3 text-gray-400" />
                <Input name="city" label="City" className="pl-10 w-full px-4 py-2 text-gray-700 bg-white rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent" />
              </div>
              <div className="relative">
                <FaFlag className="absolute top-3 left-3 text-gray-400" />
                <Input name="state" label="State" className="pl-10 w-full px-4 py-2 text-gray-700 bg-white rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent" />
              </div>
              <div className="relative">
                <FaMapPin className="absolute top-3 left-3 text-gray-400" />
                <Input name="pincode" label="Pincode" className="pl-10 w-full px-4 py-2 text-gray-700 bg-white rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent" />
              </div>
            </div>
            <button
              type="submit"
              className="mt-8 w-full bg-green-500 text-white px-6 py-3 rounded-md text-lg font-medium transition duration-300 ease-in-out hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
            >
              Add City Admin
            </button>
          </div>
        </FormWrapper>
      </div>
    </div>
  );
}

export default AddCityAdmin;

