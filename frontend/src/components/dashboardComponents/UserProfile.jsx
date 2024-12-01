import React from 'react'
import { FaRegCircleUser } from "react-icons/fa6";

function UserProfile({user}) {

  const avatarUrl = user.avatarImage? user.avatarImage : `https://eu.ui-avatars.com/api/?name=${user.username}&size=250`;
  return (
    <div  className='flex items-center'>
        <div>
            <div className='w-[10em] h-[10em] rounded-full'
              style={{backgroundImage: `url(${avatarUrl})`, backgroundSize: "cover", backgroundPosition: "center"}}
            ></div>
          
        </div>
      <div className='flex flex-col p-5 '>
        <h3 className='text-2xl font-bold text-gray-900'>{user.username}</h3>
        <p>{user.email}</p>
        <p>{user.phoneNo}</p>
        <p>{user.location.properties.city}, {user.location.properties.state}</p>
        <button className=' w-[20%] p-2 rounded-lg bg-black text-white'>Edit</button>
      </div>
    </div>
  )
}

export default UserProfile
