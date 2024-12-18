import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchDashboardStats } from '../../api/users';

function DashboardStats() {
  const { data: stats } = useQuery({
    queryKey: ["stats"],
    queryFn: fetchDashboardStats,
    enabled: true
  });

  return (
    <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6'>
      {stats && Object.entries(stats).map(([key, value]) => (
        <div
          key={key}
          className=" p-8 sm:p-4 md:p-6 rounded-xl bg-gradient-to-br from-white to-gray-100 shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out"
        >
          <div className="flex flex-col items-center">
            <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-600 mb-1 sm:mb-2 uppercase tracking-wide text-center">
              {key}
            </h3>
            <p className="text-xl sm:text-2xl md:text-3xl font-bold text-indigo-600">
              {value}
            </p>
          </div>
          <div className="mt-2 sm:mt-3 md:mt-4 h-1 w-full bg-indigo-200 rounded-full overflow-hidden">
            <div className="h-1 bg-indigo-600 w-1/2 rounded-full"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default DashboardStats;