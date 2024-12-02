import React from "react";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import toast from "react-hot-toast";

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

function AddCityAdmin({setAddCityAdmin}) {
  const { mutateAsync: fetchCoordinates } = useFetchCoordinates();

  const addCityAdminMutation = useMutation({
    mutationFn: addCityAdmin,
    onSuccess: () => {
      toast.success("city admin added successfully");
      setAddCityAdmin(false);
    },
    onError: (error) => {
      console.log(error);
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
    <div className=" w-full h-full absolute top-0 bg-gray-300 flex justify-center items-center">
        <div className=" flex flex-wrap">
            <div className="basis-full">
                <button
                    className=" text-xl text-black " 
                    onClick={() => setAddCityAdmin(false)}
                >
                    x
                </button>
            </div>
        <div>
            <FormWrapper onSubmit={handleSubmit} schema={cityAdminSchema}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {/* Username Field */}
                <Input name="username" label="Username" type="text" />
                {/* Email Field */}
                <Input name="email" label="Email" type="email" />
                {/* Phone Number Field */}
                <Input name="phoneNo" label="Phone Number" type="text" />
                {/* Password Field */}
                <Input name="password" label="Password" type="password" />
                {/* Location Fields */}
                <Input name="address" label="Address" />
                <Input name="city" label="City" />
                <Input name="state" label="State" />
                <Input name="pincode" label="Pincode" />
            </div>

          <button
            type="submit"
            className="w-full bg-green-600 text-white px-6 py-3 rounded-md text-base sm:text-lg font-medium transition duration-300 ease-in-out hover:bg-green-700 shadow-md hover:shadow-lg"
          >
            Add city admin
          </button>
        </FormWrapper>
        </div>
        </div>
    </div>
  );
}

export default AddCityAdmin;
