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
    <div className="fixed inset-0 bg-gray-800 bg-opacity-70 overflow-y-auto h-full w-full flex justify-center items-center border border-gray-900">
      <div className="relative bg-white w-full max-w-4xl mx-auto p-8 rounded-xl shadow-lg">
        <button
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 transition-colors duration-200"
          onClick={() => setAddCityAdmin(false)}
        >
          <IoClose className="text-2xl" />
        </button>
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center ">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-green-500">
            Add City Admin
          </span>
        </h2>
        <FormWrapper onSubmit={handleSubmit} schema={cityAdminSchema}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { name: "username", label: "Username", type: "text" },
              { name: "email", label: "Email", type: "email" },
              { name: "phoneNo", label: "Phone Number", type: "text" },
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
                  className="w-full px-4 py-3 text-gray-700 "
                />
              </div>
            ))}
          </div>
          <button
            type="submit"
            className="mt-8 w-full py-3 px-6 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600"
          >
            Add City Admin
          </button>
        </FormWrapper>
      </div>
    </div>
  );
}

export default AddCityAdmin;