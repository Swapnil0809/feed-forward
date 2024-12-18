import React from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { fetchVerificationList, verifyRecipient } from '../../api/cityAdmin';

const CityAdminDashboard = () => {
  const { data: verificationList } = useQuery({
    queryKey: ["VerificationList"],
    queryFn: fetchVerificationList,
    enabled: true
  });

  const verifyRecipientMutation = useMutation({
    mutationFn: verifyRecipient,
    onSuccess: () => {
      toast.success("Recipient verified successfully");
    },
    onError: (error) => {    
      console.log(error);
      toast.error("Failed to verify recipient");
    }
  });

  return (
    <div className="bg-gradient-to-r from-green-100 via-teal-100 to-blue-100 min-h-screen py-4 sm:py-6 md:py-9">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 rounded-lg bg-white shadow-md">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 bg-clip-text text-transparent bg-gradient-to-r from-teal-500 to-blue-600 mb-6">City Admin Dashboard</h1>
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-4 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4">Recipient Verification</h2>
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 sm:pr-4">
              {verificationList && verificationList.map((recipient) => (
                <div key={recipient._id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-gray-50 p-4 rounded-lg transition duration-300 ease-in-out hover:bg-gray-100">
                  <div className="flex items-center space-x-4 mb-4 sm:mb-0">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full overflow-hidden flex-shrink-0 border-2 border-indigo-200">
                      <img
                        src={`https://eu.ui-avatars.com/api/?name=${recipient.username}&size=250`}
                        alt={recipient.username}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-medium text-gray-900">{recipient.username}</h3>
                      <p className="text-xs sm:text-sm text-gray-700">{recipient.email}</p>
                      <p className="text-xs sm:text-sm text-gray-700">{recipient.phoneNo}</p>
                      <p className="text-xs sm:text-sm text-gray-700">{recipient.location.properties.city}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2 sm:space-x-3 w-full sm:w-auto">
                    <button 
                      className="flex-1 sm:flex-none px-3 sm:px-4 py-2 text-sm sm:text-base bg-green-500 text-white rounded-xl hover:bg-green-600  "
                      onClick={() => verifyRecipientMutation.mutate(recipient._id)}
                    >
                      Verify
                    </button>
                    <button 
                      className="flex-1 sm:flex-none px-3 sm:px-4 py-2 text-sm sm:text-base bg-red-500 text-white rounded-xl hover:bg-red-600 "
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CityAdminDashboard;