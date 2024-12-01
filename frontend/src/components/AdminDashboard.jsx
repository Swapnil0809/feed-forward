import React, { useState } from 'react';
import {useQuery} from '@tanstack/react-query'
import {z} from "zod"

import FormWrapper from './formComponents/FormWrapper';
import Input from './formComponents/Input';
import { fetchCityAdmins } from '../api/admin';

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

  const {data:cityAdmins} = useQuery({
    queryKey:["cityAdmins"],
    queryFn:fetchCityAdmins,
    enabled:true
  })

  const handleSubmit = (data) => {
    console.log(data)
  }


  return (
    <>
      <div className=' max-w-7xl mx-auto flex justify-evenly p-5 border-black border-[2px]'>
        <div className='w-[50%] p-5 flex flex-col gap-5 border-black border-[2px]'>
          <h1 className=' text-2xl font-bold text-gray-900'>City Admins</h1>
          <button className='w-[8em] p-2 rounded-lg bg-green-500 text-white'>add</button>
          {
            cityAdmins && cityAdmins.map((cityAdmin) => (
              <div key={cityAdmin._id} className='flex items-center gap-5 p-5 border-black border-[2px]'>
                <div className='w-[5em] h-[5em] rounded-full ' 
                  style={{
                    backgroundImage: `url(https://eu.ui-avatars.com/api/?name=${cityAdmin.username}&size=250)`, 
                    backgroundSize: "cover", 
                    backgroundPosition: "center"
                  }}
              ></div>
                <div>
                  <h1>{cityAdmin.username}</h1>
                  <p>{cityAdmin.email}</p>
                  <p>{cityAdmin.phoneNo}</p>
                  <p>{cityAdmin.location.properties.city}</p>
                </div>
                <div>
                  <button className='w-[8em] p-2 rounded-lg bg-red-500 text-white'>delete</button>
                </div>
              </div>
            ))
          }
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

