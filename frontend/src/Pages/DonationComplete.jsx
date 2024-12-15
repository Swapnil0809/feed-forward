import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import { updateDonationStatus } from '../api/donation';

function DonationComplete() {
    const { donationId } = useParams();

    const { data: status, isLoading, isError, error } = useQuery({
        queryKey: ["donationStatus"],
        queryFn: () => updateDonationStatus(donationId),
        enabled: true        
    });

    if (isLoading) return <p>Loading...</p>;
    if (isError) return <p>Error: {error.message}</p>;

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center px-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl overflow-hidden">
                <div className="p-8 bg-gradient-to-b from-white to-green-50">
                    <div className="text-center">
                        <div className="inline-block mb-8 bg-green-100 p-4 rounded-full">
                            <svg className="w-24 h-24 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                        </div>
                        <h2 className="text-5xl font-extrabold text-gray-800 mb-4 tracking-tight">Thank You!</h2>
                        <p className="text-xl text-gray-600 mb-8">Your donation has been successfully completed.</p>
                        <div className="mb-8">
                            <span className="text-6xl" role="img" aria-label="Celebration">🎉</span>
                        </div>
                        <p className="text-lg text-gray-700 mb-8 font-medium px-4 py-3 bg-green-100 rounded-lg inline-block">
                            Your generosity makes a real difference in someone's life.
                        </p>
                        <button 
                            className="inline-block px-8 py-4 text-lg font-semibold text-white bg-green-500 rounded-xl hover:bg-green-600"
                        >
                            Return to Home
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DonationComplete;

