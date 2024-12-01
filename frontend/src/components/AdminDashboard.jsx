import React, { useState } from 'react';
import {z} from "zod"

import FormWrapper from './formComponents/FormWrapper';
import Input from './formComponents/Input';

const cityAdminSchema = z.object({
  username: z.string().nonempty("Username is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  address: z.string().nonempty("Address is required"),
  city: z.string().nonempty("City is required"),
  state: z.string().nonempty("State is required"),
  pincode: z.string().nonempty("Pincode is required"),
});

const AdminDashboard = () => {

  const handleSubmit = (data) => {
    console.log(data)
  }


  return (
    <>
      <div className=' max-w-7xl mx-auto flex justify-evenly p-5 border-black border-[2px]'>
        <div className='x]'>
          <FormWrapper onSubmit={handleSubmit} schema={cityAdminSchema}>
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
            </div>
            <button
            type="submit"
            className="w-full bg-green-600 text-white px-6 py-3 rounded-md text-base sm:text-lg font-medium transition duration-300 ease-in-out hover:bg-green-700 shadow-md hover:shadow-lg"
          >
            Add city admin
          </button>
          </FormWrapper>
        </div>
        <div className=''>
          <h3 className=' text-2xl font-bold text-gray-900'>Total cityAdmins: 5</h3>
          <h3 className=' text-2xl font-bold text-gray-900'>Total Donations Today: 10</h3>
          <h3 className=' text-2xl font-bold text-gray-900'>Total User : 100</h3>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;

