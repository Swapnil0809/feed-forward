import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import Layout from './Layout';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const CityAdminDashboard = () => {
  const [recipients, setRecipients] = useState([
    { id: 1, name: 'Shelter A', status: 'Pending' },
    { id: 2, name: 'Food Bank B', status: 'Verified' },
  ]);

  const [posts, setPosts] = useState([
    { id: 1, title: 'Fresh Vegetables', donor: 'John Doe', recipient: 'Shelter A', status: 'Delivered' },
    { id: 2, title: 'Canned Goods', donor: 'Jane Smith', recipient: 'Food Bank B', status: 'In Transit' },
  ]);

  const handleVerify = (id) => {
    setRecipients(recipients.map(recipient => 
      recipient.id === id ? { ...recipient, status: 'Verified' } : recipient
    ));
  };

  const handleUpdatePostStatus = (id, newStatus) => {
    setPosts(posts.map(post => 
      post.id === id ? { ...post, status: newStatus } : post
    ));
  };

  const activityData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Donations',
        data: [4, 3, 2, 6, 8, 5, 4],
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
      {
        label: 'Requests',
        data: [3, 2, 4, 5, 7, 6, 3],
        borderColor: 'rgb(255, 99, 132)',
        tension: 0.1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Weekly Activity',
      },
    },
  };

  return (
    <Layout title="City Admin Dashboard">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Recipient Verification</h2>
          <div className="space-y-4">
            {recipients.map(recipient => (
              <div key={recipient.id} className="flex justify-between items-center p-4 bg-gray-100 rounded-lg">
                <div>
                  <h3 className="font-semibold">{recipient.name}</h3>
                  <p className="text-sm text-gray-600">Status: {recipient.status}</p>
                </div>
                {recipient.status === 'Pending' && (
                  <button 
                    onClick={() => handleVerify(recipient.id)}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                  >
                    Verify
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Weekly Activity</h2>
          <Line data={activityData} options={options} />
        </div>
      </div>
      <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Recent Posts and Requests</h2>
        <div className="space-y-4">
          {posts.map(post => (
            <div key={post.id} className="p-4 bg-gray-100 rounded-lg">
              <h3 className="font-semibold">{post.title}</h3>
              <p className="text-sm text-gray-600">Donor: {post.donor}</p>
              <p className="text-sm text-gray-600">Recipient: {post.recipient}</p
>
              <p className="text-sm text-gray-600">Status: {post.status}</p>
              <div className="mt-2">
                <button 
                  onClick={() => handleUpdatePostStatus(post.id, 'In Transit')}
                  className="bg-blue-500 text-white px-3 py-1 rounded mr-2 hover:bg-blue-600"
                >
                  Mark In Transit
                </button>
                <button 
                  onClick={() => handleUpdatePostStatus(post.id, 'Delivered')}
                  className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                >
                  Mark Delivered
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default CityAdminDashboard;

