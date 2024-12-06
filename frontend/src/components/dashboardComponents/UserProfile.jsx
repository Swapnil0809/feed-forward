import React from "react";

function UserProfile({ user }) {
  const avatarUrl =
    user.avatarImage ||
    `https://eu.ui-avatars.com/api/?name=${user.username}&size=250`;

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-2xl">
      <div className="md:flex">
        <div className="md:flex-shrink-0 p-6 flex items-center justify-center ">
          <div
            className="w-48 h-48 rounded-full border-4 border-white shadow-lg"
            style={{
              backgroundImage: `url(${avatarUrl})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          ></div>
        </div>
        <div className="p-8">
          <div className="uppercase tracking-wide text-sm text-gray-500 font-bold mb-1">
            User Profile
          </div>
          <h3 className="text-3xl font-bold text-gray-900 mb-4">
            {user.username}
          </h3>
          <div className="space-y-4">
            <ProfileItem icon="email" value={user.email} />
            <ProfileItem icon="phone" value={user.phoneNo} />
            <ProfileItem
              icon="location"
              value={`${user.location.properties.city}, ${user.location.properties.state}`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function ProfileItem({ icon, value }) {
  const icons = {
    email: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
      />
    ),
    phone: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
      />
    ),
    location: (
      <>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </>
    ),
  };

  return (
    <div className="flex items-center text-gray-700">
      <svg
        className="h-6 w-6 mr-3 text-teal-500"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        {icons[icon]}
      </svg>
      <span className="text-lg">{value}</span>
    </div>
  );
}

export default UserProfile;

