import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import { fetchCityAdmins, removeCityAdmin } from '../../api/admin';
import AddCityAdmin from './AddCityAdmin';

const AdminDashboard = () => {
  const [addCityAdmin, setAddCityAdmin] = useState(false);

  const { data: cityAdmins } = useQuery({
    queryKey: ["cityAdmins"],
    queryFn: fetchCityAdmins,
    enabled: true
  });

  const removeCityAdminMutation = useMutation({
    mutationFn: removeCityAdmin,
    onSuccess: () => {
      toast.success("City Admin removed successfully");
    },
    onError: (error) => {
      console.log(error);
      toast.error("Failed to remove City Admin");
    }
  });

  return (
    <>
      <div className="min-h-screen bg-gradient-to-r from-green-100 via-teal-100 to-blue-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            <div className="px-6 py-8 sm:px-10 sm:py-12">
              <h1 className="text-5xl font-extrabold text-center mb-12">
                <span className="basis-full text-5xl font-bold text-gray-900 bg-clip-text text-transparent bg-gradient-to-r from-teal-500 to-blue-600">
                  City Admin
                </span>
              </h1>
              <div className="flex justify-center mb-10">
                <button 
                  className="px-8 py-3 bg-green-500 text-white font-bold rounded-xl hover:bg-green-600  shadow-lg"
                  onClick={() => setAddCityAdmin(true)}
                >
                  Add New Admin
                </button>
              </div>
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {cityAdmins && cityAdmins.map((cityAdmin) => (
                  <div key={cityAdmin._id} className="bg-white rounded-2xl shadow-lg overflow-hidden  border border-gray-200">
                    <div className="p-6">
                      <div className="flex items-center mb-4">
                        <div 
                          className="w-20 h-20 rounded-full mr-4 border-4 border-gray-300 shadow-lg" 
                          style={{
                            backgroundImage: `url(https://eu.ui-avatars.com/api/?name=${cityAdmin.username}&size=250)`, 
                            backgroundSize: "cover", 
                            backgroundPosition: "center"
                          }}
                        ></div>
                        <div>
                          <h2 className="text-2xl font-bold text-gray-800">{cityAdmin.username}</h2>
                          <p className="text-sm text-gray-600">{cityAdmin.email}</p>
                        </div>
                      </div>
                      <div className="mb-6 bg-gray-50 rounded-lg p-4 shadow-inner">
                        <p className="text-gray-700 mb-2 flex items-center">
                          <span className="font-semibold text-teal-600 mr-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                          </span>
                          {cityAdmin.phoneNo}
                        </p>
                        <p className="text-gray-700 flex items-center">
                          <span className="font-semibold text-teal-600 mr-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                          </span>
                          {cityAdmin.location.properties.city}
                        </p>
                      </div>
                      <button 
                        className="w-full py-3 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 shadow-lg"
                        onClick={() => removeCityAdminMutation.mutate(cityAdmin._id)}
                      >
                        Remove Admin
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      {addCityAdmin && <AddCityAdmin setAddCityAdmin={setAddCityAdmin} />}
    </>
  );
};

export default AdminDashboard;