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
    <div>
      donation {status}
    </div>
  )
}

export default DonationComplete
