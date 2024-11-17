import React, { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';

const SignUp = () => {
  const [userType, setUserType] = useState(null);
  const avatarImage = useRef(null);
  const [avatar, setAvatar] = useState("");
  const { register, handleSubmit, formState: { errors }, setValue} = useForm();

  const onSubmit = (data) => {
    console.log(data);

    const formData = new FormData();

    // add all form fields
    Object.keys(data).forEach((key) => {
      formData.append(key,data[key]);
    })
    

    for (const [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }
    
  };

  const handleChange = (event) => {
    setAvatar(event.target.files[0])
    setValue('avatar', event.target.files[0]); // update form state
  }

  const handleClick = () => {
    avatarImage.current.click();
  }

  const renderForm = () => {
    if (!userType) {
      return (
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-6">Are you a Donor or a Recipient?</h2>
          <div className="space-x-4">
            <button
              type="button"
              className="bg-blue-500 text-white px-6 py-3 rounded-lg text-lg font-medium transition duration-300 ease-in-out hover:bg-blue-600 hover:shadow-lg"
              onClick={() => setUserType('donor')}
            >
              Donor
            </button>
            <button
              type="button"
              className="bg-green-500 text-white px-6 py-3 rounded-lg text-lg font-medium transition duration-300 ease-in-out hover:bg-green-600 hover:shadow-lg"
              onClick={() => setUserType('recipient')}
            >
              Recipient
            </button>
          </div>
        </div>
      );
    }

    return (
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* avatar */}
        <div className=' flex justify-center items-center'>
          <label htmlFor="avatar"></label>
          <div className="w-[10em] h-[10em] rounded-full border-black border-[2px]" 
            style={{
              backgroundImage:avatar? `url(${URL.createObjectURL(avatar)})`:"none",
              backgroundSize:"cover",
              backgroundPosition:"center"
            }}
            onClick={handleClick}
          >
          </div>
          <input 
            type="file" 
            {...register("avatar")}
            onChange={handleChange} 
            ref={avatarImage} 
            className='hidden'
            
          />
        </div>
        {/* username */}
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">Username</label>
          <input
            id="username"
            {...register('username', { required: 'Username is required' })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.username && <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>}
        </div>
        {/* email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            id="email"
            type="email"
            {...register('email', { required: 'Email is required' })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
        </div>
        {/* phoneno */}
        <div>
          <label htmlFor="phoneNo" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
          <input
            id="phoneNo"
            {...register('phoneNo', { required: 'Phone number is required' })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.phoneNo && <p className="mt-1 text-sm text-red-600">{errors.phoneNo.message}</p>}
        </div>
        {/* password */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input
            id="password"
            type="password"
            {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Password must be at least 8 characters' } })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
        </div>
        {/* address */}
        <div>
          <label htmlFor="address" className='block text-sm font-medium text-gray-700 mb-1'>Address</label>
          <input 
            id="address"
            type="text"
            {...register('location.properties.address', { required: 'Address is required' })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.location?.properties?.address && <p className="mt-1 text-sm text-red-600">{errors.location?.properties?.address.message}</p>}
        </div>
        {/* city */}
        <div>
          <label htmlFor="city" className='block text-sm font-medium text-gray-700 mb-1'>City</label>
          <input 
            id="city"
            type="text"
            {...register('location.properties.city', { required: 'City is required' })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.location?.properties?.city && <p className="mt-1 text-sm text-red-600">{errors.location?.properties?.city.message}</p>}
        </div>
        {/* state */}
        <div>
          <label htmlFor="state" className='block text-sm font-medium text-gray-700 mb-1'>State</label>
          <input 
            id="state"
            type="text"
            {...register('location.properties.state', { required: 'State is required' })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.location?.properties?.state && <p className="mt-1 text-sm text-red-600">{errors.location?.properties?.state.message}</p>}
        </div>
        {/* pincode */}
        <div>
          <label htmlFor="pincode" className='block text-sm font-medium text-gray-700 mb-1'>Pincode</label>
          <input 
            id="pincode"
            type="text"
            {...register('location.properties.pincode', { required: 'Pincode is required' })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.location?.properties?.pincode && <p className="mt-1 text-sm text-red-600">{errors.location?.properties?.pincode.message}</p>}
        </div>

        {/* donor  */}
        {userType === 'donor' && (
          <div>
            <label htmlFor="donorType" className="block text-sm font-medium text-gray-700 mb-1">Donor Type</label>
            <select
              id="donorType"
              {...register('donorType', { required: 'Donor type is required' })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select donor type</option>
              <option value="individual">Individual</option>
              <option value="restaurant">Restaurant</option>
            </select>
            {errors.donorType && <p className="mt-1 text-sm text-red-600">{errors.donorType.message}</p>}
          </div>
        )}

        {/* recipient */}
        {userType === 'recipient' && (
          <>
            <div>
              <label htmlFor="organizationType" className="block text-sm font-medium text-gray-700 mb-1">Organization Type</label>
              <select
                id="organizationType"
                {...register('organizationType', { required: 'Organization type is required' })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select organization type</option>
                <option value="charity">Charity</option>
                <option value="shelter">Shelter</option>
                <option value="community group">Community Group</option>
                <option value="NGO">NGO</option>
              </select>
              {errors.organizationType && <p className="mt-1 text-sm text-red-600">{errors.organizationType.message}</p>}
            </div>

            <div>
              <label htmlFor="registrationNo" className="block text-sm font-medium text-gray-700 mb-1">Registration Number</label>
              <input
                id="registrationNo"
                {...register('registrationNo', { required: 'Registration number is required' })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.registrationNo && <p className="mt-1 text-sm text-red-600">{errors.registrationNo.message}</p>}
            </div>
          </>
        )}

        <button
          type="submit"
          className="w-full bg-blue-500 text-white px-6 py-3 rounded-lg text-lg font-medium transition duration-300 ease-in-out hover:bg-blue-600 hover:shadow-lg"
        >
          Register as {userType === 'donor' ? 'Donor' : 'Recipient'}
        </button>
      </form>
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-2xl p-8 bg-white rounded-xl shadow-2xl">
        <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">User Registration</h1>
        {renderForm()}
      </div>
    </div>
  );
};

export default SignUp;