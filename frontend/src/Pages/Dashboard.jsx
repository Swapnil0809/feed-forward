import React from 'react'
import { useQuery,useMutation } from '@tanstack/react-query';

import axiosInstance from '../utils/axiosInstance';
import Header from '../components/Header';
import AdminDashboard from "../components/AdminDashboard"
import CityAdminDashboard from "../components/CityAdminDashboard";
import DonorDashboard from "../components/DonorDashboard";
import RecipientDashboard from "../components/RecipientDashboard";
import UserProfile from '../components/dashboardComponents/UserProfile';

const fetchUserProfile = async () => {
    const response = await axiosInstance.get('/users/get-user-profile');
    return response.data.data;
}

function Dashboard() {

    const { data:user,isLoading, isError, error } = useQuery({
        queryKey:["userProfile"],
        queryFn: fetchUserProfile,
        enabled:true,
    });

    if (isLoading) return <p>Loading profile...</p>;
    if (isError) return <p>Error: {error.message}</p>;


  return (
    <div>
        <Header/>
        <main>
          <div className='max-w-7xl mx-auto flex flex-wrap items-center gap-5 p-5 my-5 rounded-lg border-black border-[2px]'>
            <h1 className=' basis-full text-3xl font-bold text-gray-900'>{user.role} Dashboard</h1>
            <UserProfile user={user}/>
          </div>
          {user?.role === "Admin" && <AdminDashboard />}
          {user?.role === "CityAdmin" && <CityAdminDashboard />}
          {user?.role === "Donor" && <DonorDashboard />}
          {user?.role === "Recipient" && <RecipientDashboard />}
        </main>
    </div>
  )
}

export default Dashboard
