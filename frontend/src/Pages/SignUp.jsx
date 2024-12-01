import React, { useState} from 'react';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { z } from "zod";
import toast from 'react-hot-toast';

import FormWrapper from '../components/formComponents/FormWrapper';
import FileInput from '../components/formComponents/FileInput';
import Input from '../components/formComponents/Input';
import Select from '../components/formComponents/Select';
import { submitSignup } from '../api/users';
import { fetchCoordinates } from '../api/fetchCoordinates';

// Validation Schema with zod
const signupSchema = z.object({
  username: z.string().nonempty("Username is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  avatarImage: z.instanceof(File).optional(),
  address: z.string().nonempty("Address is required"),
  city: z.string().nonempty("City is required"),
  state: z.string().nonempty("State is required"),
  pincode: z.string().nonempty("Pincode is required"),
  donorType: z.string().optional(),
  organizationType: z.string().optional(),
  registrationNo: z.string().optional()
});

export default function Signup() {
  const [userType, setUserType] = useState(null);
  // const avatarImage = useRef(null);
  // const [avatar, setAvatar] = useState("");

  const navigate = useNavigate();

  const fetchCoordinatesMutation = useMutation({
    mutationFn: (pincode) => fetchCoordinates(pincode)
  });

  const submitSignupMutation = useMutation({
    mutationFn: submitSignup,
    onSuccess: (data) => {
      toast.success("signup successful")
      console.log("Server response:", data);
      navigate('/login');
    },
    onError: (error) => {
      console.log(error)
    },
  });

  // const handleAvatarChange = (event) => {
  //   setAvatar(event.target.files[0]);
  // };

  // const handleAvatarClick = () => {
  //   avatarImage.current.click();
  // };

  const createFormData = (data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) formData.append(key, value);
    });
    return formData;
  };

  const handleSubmit = async (data) => {
    try {
      console.log(data)
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
              I&apos;m a Recipient
            </button>
          </div>
        </div>
      );
    }

    return (
      <FormWrapper onSubmit={handleSubmit} schema={signupSchema}>
        <div className="flex justify-center mb-6">
          {/* <div
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
          </div> */}
            <FileInput
              name="avatarImage"
              label="Avatar Image"
              multiple={false} // Single file for profile picture
              previewStyle="profile" // Circular preview
            />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {/* Username Field */}
          <Input name="username" label="Username" type="text" />
          {/* Email Field */}
          <Input name="email" label="Email" type="email" />
          {/* Password Field */}
          <Input name="password" label="Password" type="password" />
          {/* Location Fields */}
          <Input name="address" label="Address"/>
          <Input name="city" label="City"/>
          <Input name="state" label="State"/>
          <Input name="pincode" label="Pincode"/>
          {/* donor specific fields */}
          {userType === 'donor' && (
            <Select
              name="donorType"
              label="Donor Type"
              options={[
                { value: "individual", label: "Individual" },
                { value: "restaurant", label: "Restaurant" },
              ]}
            />
          )}
          {/* recipient specific fields */}
          {userType === 'recipient' && (
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
              <Input name="registrationNo" label="Registration Number"/>
            </>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 text-white px-6 py-3 rounded-md text-base sm:text-lg font-medium transition duration-300 ease-in-out hover:bg-green-700 shadow-md hover:shadow-lg"
        >
          Register as {userType === 'donor' ? 'Donor' : 'Recipient'}
        </button>
      </FormWrapper>
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
