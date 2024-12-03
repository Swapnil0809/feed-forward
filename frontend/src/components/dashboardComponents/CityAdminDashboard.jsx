import React, { useState } from 'react';

const CityAdminDashboard = () => {
  

  return (
    <>
      <div className=' max-w-7xl max-h-[50vh] mx-auto flex p-5 rounded-lg border-black border-[2px]'>
        <div className='w-[50%] max-h-[90%] p-5 flex flex-col gap-5 rounded-lg border-black border-[2px]'>
          <h1 className=' text-2xl font-bold text-gray-900'>Recipient Verification</h1>
          <button 
            className='w-[8em] p-2 rounded-lg bg-green-500 text-white'
            
          >
            add
          </button>
          <div className=' flex flex-col gap-5 overflow-y-auto'>
            
          </div>
        </div>
      </div>
    </>
  );
};

export default CityAdminDashboard;

