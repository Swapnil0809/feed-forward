import React from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query';

import { updateDonationStatus } from '../api/donation';

function DonationComplete() {
    const {donationId } = useParams();

    const {data:status,isLoading,isError,error} = useQuery({
        queryKey:["donationStatus"],
        queryFn: () => updateDonationStatus(donationId),
        enabled: true        
    })

    if (isLoading) return <p>Loading...</p>;
    if (isError) return <p>Error: {error.message}</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-2xl overflow-hidden">
      <div className="p-8">
          <div className="text-center">
            <div className="inline-block p-4 bg-green-100 rounded-full mb-4">
              <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Thank You!</h2>
            <p className="text-lg text-gray-600 mb-6">Your donation has been successfully completed.</p>
            <div className="animate-bounce">
              <span className="inline-block bg-yellow-400 rounded-full p-2" role="img" aria-label="Celebration">
                🎉
              </span>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 px-8 py-6">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-4">Your generosity makes a real difference in someone's life.</p>
            <button 
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-150 ease-in-out"
            >
              Return to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DonationComplete
