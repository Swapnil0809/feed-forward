import React from 'react'
import { useQuery } from '@tanstack/react-query'

import { fetchDashboardStats } from '../../api/users'

function DashboardStats() {

    const {data:stats} = useQuery({
        queryKey: ["stats"],
        queryFn: fetchDashboardStats,
        enabled: true
    })

  return (
    <div className='flex gap-5'>
      {stats && Object.entries(stats).map(([key, value]) => (
          <div
            key={key}
            className="p-5 border-[2px] border-black rounded-lg bg-gray-100 text-center"
          >
            <h3 className="text-lg font-semibold text-gray-800">{key}</h3>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
          </div>
        ))}
    </div>
  )
}

export default DashboardStats
