import React from 'react'
import { useForm } from 'react-hook-form';
import axiosInstance from '../utils/axiosInstance';
import { useMutation } from '@tanstack/react-query';

const userLogin = async (formData) => {
    const response = await axiosInstance.post("users/login",formData)
    return response.data;
}

function Login() {
    const { register, handleSubmit, formState: { errors }} = useForm();

    const userLoginMutation = useMutation({
        mutationFn:userLogin,
        onSuccess: (data) => {
            alert("Login successful!");
            console.log("Server response:", data);
          },
          onError: (error) => {
            alert(`Error during login: ${error.message}`);
          },
    })

    const onSubmit = (data) => {
        userLoginMutation.mutate(data);
    }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-2xl p-8 bg-white rounded-xl shadow-2xl">
        <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">User Registration</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            id="email"
            type="email"
            {...register('email', { required: 'Email is required' })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
        </div>
         {/* password */}
         <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input
            id="password"
            type="password"
            {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Password must be at least 8 characters' } })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white px-6 py-3 rounded-lg text-lg font-medium transition duration-300 ease-in-out hover:bg-blue-600 hover:shadow-lg"
        >
          Login
        </button>
      </form>
      </div>
    </div>
  )
}

export default Login
