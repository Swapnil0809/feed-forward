import React, { useState } from 'react';
import {useQuery, useMutation} from '@tanstack/react-query'
import toast from 'react-hot-toast';

import { fetchCityAdmins, removeCityAdmin } from '../../api/admin';
import AddCityAdmin from './AddCityAdmin';

const AdminDashboard = () => {

  const [addCityAdmin,setAddCityAdmin] = useState(false)

  const {data:cityAdmins} = useQuery({
    queryKey:["cityAdmins"],
    queryFn:fetchCityAdmins,
    enabled:true
  })

  const removeCityAdminMutation = useMutation({
    mutationFn:removeCityAdmin,
    onSuccess:() => {
      toast.success("City Admin removed successfully")
    },
    onError:(error) => {
      console.log(error)
    }
  })


  return (
    <>
      <div className=' max-w-7xl max-h-[50vh] mx-auto flex p-5 rounded-lg border-black border-[2px]'>
        <div className='w-[50%] max-h-[90%] p-5 flex flex-col gap-5 rounded-lg border-black border-[2px]'>
          <h1 className=' text-2xl font-bold text-gray-900'>City Admins</h1>
          <button 
            className='w-[8em] p-2 rounded-lg bg-green-500 text-white'
            onClick={() => setAddCityAdmin(true)}
          >
            add
          </button>
          <div className=' flex flex-col gap-5 overflow-y-auto'>
          {
            cityAdmins && cityAdmins.map((cityAdmin) => (
              <div key={cityAdmin._id} className='flex justify-evenly items-center  p-5 rounded-lg border-black border-[2px]'>
                <div className='w-[5em] h-[5em] rounded-full ' 
                  style={{
                    backgroundImage: `url(https://eu.ui-avatars.com/api/?name=${cityAdmin.username}&size=250)`, 
                    backgroundSize: "cover", 
                    backgroundPosition: "center"
                  }}
              ></div>
                <div>
                  <h1>{cityAdmin.username}</h1>
                  <p>{cityAdmin.email}</p>
                  <p>{cityAdmin.phoneNo}</p>
                  <p>{cityAdmin.location.properties.city}</p>
                </div>
                <div>
                  <button 
                  className='w-[8em] p-2 rounded-lg bg-red-500 text-white border-none'
                  onClick={() => removeCityAdminMutation.mutate(cityAdmin._id)}
                  >
                    delete
                  </button>
                </div>
              </div>
            ))
          }
          </div>
        </div>
      </div>
      {addCityAdmin && <AddCityAdmin setAddCityAdmin={setAddCityAdmin} />}
    </>
  );
};

export default AdminDashboard;

