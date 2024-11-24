import React, { useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import Layout from './Layout';

ChartJS.register(ArcElement, Tooltip, Legend);

const RecipientDashboard = () => {
  const [availablePosts, setAvailablePosts] = useState([
    { id: 1, title: 'Fresh Vegetables', description: 'Assorted fresh vegetables', quantity: '10 kg', donor: 'John Doe' },
    { id: 2, title: 'Canned Goods', description: 'Various canned foods', quantity: '20 cans', donor: 'Jane Smith' },
  ]);

  const [requestedPosts, setRequestedPosts] = useState([]);

  const handleRequest = (post) => {
    setAvailablePosts(availablePosts.filter(p => p.id !== post.id));
    setRequestedPosts([...requestedPosts, { ...post, status: 'Pending' }]);
  };

  const foodTypeData = {
    labels: ['Vegetables', 'Fruits', 'Grains', 'Protein'],
    datasets: [
      {
        data: [400, 300, 300, 200],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
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
        text: 'Food Type Distribution',
      },
    },
  };

  return (
    <Layout title="Recipient Dashboard">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Available Food Posts</h2>
          <div className="space-y-4">
            {availablePosts.map(post => (
              <div key={post.id} className="p-4 bg-gray-100 rounded-lg">
                <h3 className="font-semibold">{post.title}</h3>
                <p className="text-sm text-gray-600">{post.description}</p>
                <p className="text-sm text-gray-600">Quantity: {post.quantity}</p>
                <p className="text-sm text-gray-600">Donor: {post.donor}</p>
                <button 
                  onClick={() => handleRequest(post)}
                  className="mt-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  Request
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Food Type Distribution</h2>
          <Pie data={foodTypeData} options={options} />
        </div>
      </div>
      <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Your Requested Posts</h2>
        <div className="space-y-4">
          {requestedPosts.map(post => (
            <div key={post.id} className="p-4 bg-gray-100 rounded-lg">
              <h3 className="font-semibold">{post.title}</h3>
              <p className="text-sm text-gray-600">{post.description}</p>
              <p className="text-sm text-gray-600">Quantity: {post.quantity}</p>
              <p className="text-sm text-gray-600">Donor: {post.donor}</p>
              <p className="text-sm text-gray-600">Status: {post.status}</p>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default RecipientDashboard;

