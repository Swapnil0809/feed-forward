import React from 'react'
import { useQuery,useMutation } from '@tanstack/react-query';

import axiosInstance from '../utils/axiosInstance';
import Header from '../components/Header';
import UserProfile from '../components/dashboardComponents/UserProfile';
import DashboardStats from '../components/dashboardComponents/DashboardStats';
import AdminDashboard from '../components/dashboardComponents/AdminDashboard';
import CityAdminDashboard from '../components/dashboardComponents/CityAdminDashboard';
import DonorDashboard from '../components/dashboardComponents/DonorDashboard';
import RecipientDashboard from '../components/dashboardComponents/RecipientDashboard';

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
    <div className='bg-gradient-to-r from-green-100 via-teal-100 to-blue-100 pt-20'>
        <Header/>
        <main>
        <div className='max-w-7xl mx-auto flex flex-wrap justify-center items-center gap-5 p-5 my-5 rounded-lg  bg-white '>
        <h1 className=' basis-full text-3xl font-bold text-gray-900 bg-clip-text text-transparent bg-gradient-to-r from-teal-500 to-blue-600'>{user.role} Dashboard</h1>
        <UserProfile user={user}/>
            <DashboardStats/>
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
