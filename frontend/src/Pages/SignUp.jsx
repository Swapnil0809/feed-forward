import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import BeatLoader from "react-spinners/BeatLoader";
import toast from "react-hot-toast";

import FormWrapper from "../components/formComponents/FormWrapper";
import FileInput from "../components/formComponents/FileInput";
import Input from "../components/formComponents/Input";
import Select from "../components/formComponents/Select";
import { useFetchCoordinates } from "../hooks/useFetchCoordinates";
import { createFormData } from "../utils/createFormData";
import { signupSchema } from "../utils/validations";
import { registerUser } from "../api/users";

export default function Signup() {
  const [userType, setUserType] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const { mutateAsync: fetchCoordinates } = useFetchCoordinates();
  const { mutate: signup } = useMutation({
    mutationFn: registerUser,
    onSuccess: (data) => {
      setIsLoading(false);
      toast.success("Signup successful");
      console.log("Server response:", data);
      navigate("/login");
    },
    onError: (error) => {
      setIsLoading(false);
      console.log(error);
      toast.error("Signup failed. Please try again.");
    },
  });

  const handleSubmit = async (data) => {
    try {
      setIsLoading(true);
      const coordinates = await fetchCoordinates(data.pincode);
      data.coordinates = coordinates;
      const formData = createFormData(data);
      const apiUrl = `/users/${userType}-signup`;
      signup({ url: apiUrl, formData });
    } catch (error) {
      console.error(error);
      toast.error("An error occurred. Please try again.");
    }
  };

  const renderForm = () => {
    if (!userType) {
      return (
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-green-800">
            Choose Your Role
          </h2>
          <div className="space-y-4 md:space-y-0 md:space-x-8 flex flex-col md:flex-row justify-center">
            <button
              type="button"
              className="bg-green-500 text-white px-8 py-4 rounded-xl text-lg md:text-xl font-medium transition duration-300 ease-in-out hover:bg-green-600 shadow-lg hover:shadow-xl w-full md:w-auto"
              onClick={() => setUserType("donor")}
            >
              I'm a Donor
            </button>
            <button
              type="button"
              disabled={isLoading}
              className="bg-green-500 text-white px-8 py-4 rounded-xl text-lg md:text-xl font-medium transition duration-300 ease-in-out hover:bg-green-600  shadow-lg hover:shadow-xl w-full md:w-auto"
              onClick={() => setUserType("recipient")}
            >
              I'm a Recipient
            </button>
          </div>
        </div>
      );
    }

    return (
      <FormWrapper onSubmit={handleSubmit} schema={signupSchema}>
        <div className="flex justify-center mb-10">
          <div className="relative">
            <FileInput
              name="avatarImage"
              label="Avatar Image"
              multiple={false}
              previewStyle="profile"
              className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-green-300 shadow-lg object-cover"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          <Input name="username" label="Username" type="text" />
          <Input name="email" label="Email" type="email" />
          <Input name="phoneNo" label="Phone Number" type="tel" />
          <Input name="password" label="Password" type="password" />
          <Input name="address" label="Address" />
          <Input name="city" label="City" />
          <Input name="state" label="State" />
          <Input name="pincode" label="Pincode" />
          {userType === "donor" && (
            <Select
              name="donorType"
              label="Donor Type"
              options={[
                { value: "individual", label: "Individual" },
                { value: "restaurant", label: "Restaurant" },
              ]}
            />
          )}
          {userType === "recipient" && (
            <>
              <Select
                name="organizationType"
                label="Organization Type"
                options={[
                  { value: "charity", label: "Charity" },
                  { value: "shelter", label: "Shelter" },
                  { value: "community group", label: "Community Group" },
                  { value: "NGO", label: "NGO" },
                ]}
              />
              <Input name="registrationNo" label="Registration Number" />
            </>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-green-500 text-white px-8 py-4 rounded-xl text-lg md:text-xl font-medium transition duration-300 ease-in-out hover:bg-green-600 hover:scale-105 transform shadow-lg hover:shadow-xl mt-10"
        >
          {isLoading ? (
            <BeatLoader size={8} color="#fff" />
          ) : (
            `Register as ${userType === "donor" ? "Donor" : "Recipient"}`
          )}
        </button>
      </FormWrapper>
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-200 via-teal-100 to-blue-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full bg-white p-8 md:p-12 rounded-3xl shadow-2xl overflow-y-auto md:overflow-visible max-h-[90vh] md:max-h-none">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-center text-green-700 mb-4">
            Join FeedForward
          </h1>
          <p className="text-center text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto">
            Sign up to start making a difference in reducing food waste
          </p>
        </div>
        {renderForm()}
      </div>
    </div>
  );
}
