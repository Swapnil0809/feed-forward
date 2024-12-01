import React from 'react'

function UserProfile({user}) {
  return (
    <div className=''>
      <div className='w-24 h-24 rounded-full' style={{backgroundImage: `url(${user.avatar})`}}></div>
      <h1>{user.username}</h1>
      <h3>{user.email}</h3>
    </div>
  )
}

export default UserProfile
