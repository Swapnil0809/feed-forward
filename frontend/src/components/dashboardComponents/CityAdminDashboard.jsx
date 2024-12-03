import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import { fetchVerificationList, verifyRecipient } from '../../api/cityAdmin';


const CityAdminDashboard = () => {

  const {data: verificationList} = useQuery({
    queryKey: ["VerificationList"],
    queryFn: fetchVerificationList,
    enabled:true
  })

  const verifyRecipientMutation = useMutation({
    mutationFn:() => verifyRecipient(id),
    onSuccess:() => {
      toast.success("recipient verified successfully")
    },
    onError:(error) => {    
      console.log(error)
    }
  })
  

  return (
    <>
      <div className=' max-w-7xl max-h-[50vh] mx-auto flex p-5 rounded-lg border-black border-[2px]'>
        <div className='w-[50%] max-h-[90%] p-5 flex flex-col gap-5 rounded-lg border-black border-[2px]'>
          <h1 className=' text-2xl font-bold text-gray-900'>Recipient Verification</h1>
          <div className=' flex flex-col gap-5 overflow-y-auto'>
            {
              verificationList && verificationList.map((recipient) => (
                <div key={recipient._id} className='flex justify-evenly items-center  p-5 rounded-lg border-black border-[2px]'>
                    <div className='w-[5em] h-[5em] rounded-full ' 
                      style={{
                        backgroundImage: `url(https://eu.ui-avatars.com/api/?name=${recipient.username}&size=250)`, 
                        backgroundSize: "cover", 
                        backgroundPosition: "center"
                      }}
                      ></div>
                    <div>
                      <h1>{recipient.username}</h1>
                      <p>{recipient.email}</p>
                      <p>{recipient.phoneNo}</p>
                      <p>{recipient.location.properties.city}</p>
                    </div>
                    <div className='flex gap-3'>
                      <button 
                        className='w-[8em] p-2 rounded-lg bg-green-500 text-white'
                        onClick={() => verifyRecipientMutation.mutate(recipient._id)}
                      >
                        verify
                      </button>
                      <button 
                      className='w-[8em] p-2 rounded-lg bg-red-500 text-white border-none'
                      >
                        reject
                      </button>
                    </div>
                </div>
              ))
            }
          </div>
        </div>
      </div>
    </>
  );
};

export default CityAdminDashboard;

