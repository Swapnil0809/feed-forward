import React, { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import axiosInstance from '../utils/axiosInstance';

const fetchCoordinates = async (pincode) => {
  const apiUrl = `https://nominatim.openstreetmap.org/search?postalcode=${pincode}&format=json&limit=1`;
  const { data } = await axiosInstance.get(apiUrl, { withCredentials: false });
  if (data.length === 0) throw new Error("Coordinates not found");
  const { lon, lat } = data[0];
  return [lon, lat];
};

const submitSignup = async ({url, formData}) => {
  const response = await axiosInstance.post(url, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export default function Signup() {
  const [userType, setUserType] = useState(null);
  const avatarImage = useRef(null);
  const [avatar, setAvatar] = useState("");
  const { register, handleSubmit, formState: { errors }, setValue } = useForm();

  const fetchCoordinatesMutation = useMutation({
    mutationFn: (pincode) => fetchCoordinates(pincode)
  });

  const submitSignupMutation = useMutation({
    mutationFn: submitSignup,
    onSuccess: (data) => {
      alert("Sign up successful!");
      console.log("Server response:", data);
    },
    onError: (error) => {
      alert(`Error during signup: ${error.message}`);
    },
  });

  const handleAvatarChange = (event) => {
    setAvatar(event.target.files[0]);
    setValue('avatarImage', event.target.files[0]);
  };

  const handleAvatarClick = () => {
    avatarImage.current.click();
  };

  const createFormData = (data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) formData.append(key, value);
    });
    return formData;
  };

  const onSubmit = async (data) => {
    try {
      const coordinates = await fetchCoordinatesMutation.mutateAsync(data.pincode);
      data.coordinates = coordinates;
      const formData = createFormData(data);
      const apiUrl = `/users/${userType}-signup`;
      submitSignupMutation.mutate({ url: apiUrl, formData });
    } catch (error) {
      console.error(error);
    }
  };

  const renderForm = () => {
    if (!userType) {
      return (
        <div className="text-center">
          <h2 className="text-xl sm:text-2xl font-semibold mb-6">Choose Your Role</h2>
          <div className="space-y-4 sm:space-y-0 sm:space-x-4 flex flex-col sm:flex-row justify-center">
            <button
              type="button"
              className="bg-green-600 text-white px-6 py-3 rounded-md text-base sm:text-lg font-medium transition duration-300 ease-in-out hover:bg-green-700 shadow-md hover:shadow-lg w-full sm:w-auto"
              onClick={() => setUserType('donor')}
            >
              I'm a Donor
            </button>
            <button
              type="button"
              className="bg-green-600 text-white px-6 py-3 rounded-md text-base sm:text-lg font-medium transition duration-300 ease-in-out hover:bg-green-700 shadow-md hover:shadow-lg w-full sm:w-auto"
              onClick={() => setUserType('recipient')}
            >
              I'm a Recipient
            </button>
          </div>
        </div>
      );
    }

    return (
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex justify-center mb-6">
          <div
            className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-green-200 overflow-hidden cursor-pointer transition-all duration-300 hover:border-green-400"
            onClick={handleAvatarClick}
          >
            {avatar ? (
              <img src={URL.createObjectURL(avatar)} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-green-50 flex items-center justify-center text-green-400 text-4xl">
                +
              </div>
            )}
          </div>
          <input
            type="file"
            {...register("avatarImage")}
            onChange={handleAvatarChange}
            ref={avatarImage}
            className="hidden"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <InputField
            label="Username"
            id="username"
            register={register}
            errors={errors}
            required
          />
          <InputField
            label="Email"
            id="email"
            type="email"
            register={register}
            errors={errors}
            required
          />
          <InputField
            label="Phone Number"
            id="phoneNo"
            register={register}
            errors={errors}
            required
          />
          <InputField
            label="Password"
            id="password"
            type="password"
            register={register}
            errors={errors}
            required
            minLength={8}
          />
          <InputField
            label="Address"
            id="address"
            register={register}
            errors={errors}
            required
          />
          <InputField
            label="City"
            id="city"
            register={register}
            errors={errors}
            required
          />
          <InputField
            label="State"
            id="state"
            register={register}
            errors={errors}
            required
          />
          <InputField
            label="Pincode"
            id="pincode"
            register={register}
            errors={errors}
            required
          />

          {userType === 'donor' && (
            <SelectField
              label="Donor Type"
              id="donorType"
              register={register}
              errors={errors}
              required
              options={[
                { value: "individual", label: "Individual" },
                { value: "restaurant", label: "Restaurant" },
              ]}
            />
          )}

          {userType === 'recipient' && (
            <>
              <SelectField
                label="Organization Type"
                id="organizationType"
                register={register}
                errors={errors}
                required
                options={[
                  { value: "charity", label: "Charity" },
                  { value: "shelter", label: "Shelter" },
                  { value: "community group", label: "Community Group" },
                  { value: "NGO", label: "NGO" },
                ]}
              />
              <InputField
                label="Registration Number"
                id="registrationNo"
                register={register}
                errors={errors}
                required
              />
            </>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 text-white px-6 py-3 rounded-md text-base sm:text-lg font-medium transition duration-300 ease-in-out hover:bg-green-700 shadow-md hover:shadow-lg"
        >
          Register as {userType === 'donor' ? 'Donor' : 'Recipient'}
        </button>
      </form>
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-100 via-teal-100 to-blue-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl w-full space-y-8 bg-white p-6 sm:p-10 rounded-lg shadow-lg border border-green-100">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-center text-green-800">Join FeedForward</h1>
          <p className="mt-2 text-center text-base sm:text-lg text-gray-600">
            Sign up to start making a difference in reducing food waste
          </p>
        </div>
        {renderForm()}
      </div>
    </div>
  );
}

function InputField({ label, id, register, errors, required, type = "text", minLength }) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        id={id}
        type={type}
        {...register(id, { 
          required: required ? `${label} is required` : false,
          minLength: minLength ? { value: minLength, message: `${label} must be at least ${minLength} characters` } : undefined
        })}
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-200"
      />
      {errors[id] && <p className="mt-1 text-sm text-red-600">{errors[id].message}</p>}
    </div>
  );
}

function SelectField({ label, id, register, errors, required, options }) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <select
        id={id}
        {...register(id, { required: required ? `${label} is required` : false })}
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-200"
      >
        <option value="">Select {label}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
      {errors[id] && <p className="mt-1 text-sm text-red-600">{errors[id].message}</p>}
    </div>
  );
}

