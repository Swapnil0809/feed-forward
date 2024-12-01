import React, { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { useForm } from 'react-hook-form';
import Layout from './Layout';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AdminDashboard = () => {
  const [cityAdmins, setCityAdmins] = useState([
    { id: 1, name: 'Alice Johnson', city: 'New York' },
    { id: 2, name: 'Bob Williams', city: 'Los Angeles' },
  ]);

  const [editingAdmin, setEditingAdmin] = useState(null);
  const { register, handleSubmit, formState: { errors }, setValue } = useForm();

  const onSubmit = (data) => {
    console.log(data)
  }

  const handleEdit = (admin) => {
    setEditingAdmin(admin);
  };

  const handleDelete = (id) => {
    setCityAdmins(cityAdmins.filter(admin => admin.id !== id));
  };

  const handleCancelEdit = () => {
    setEditingAdmin(null);
  };

  const cityData = {
    labels: ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix'],
    datasets: [
      {
        label: 'Users',
        data: [4000, 3000, 2000, 2780, 1890],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
      {
        label: 'Donations',
        data: [2400, 1398, 9800, 3908, 4800],
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
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
        text: 'City Statistics',
      },
    },
  };

  return (
    <Layout title="Admin Dashboard">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">{editingAdmin ? 'Edit City Admin' : 'Create City Admin'}</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
              {editingAdmin ? 'Update City Admin' : 'Create City Admin'}
            </button>
            {editingAdmin && (
              <button type="button" onClick={handleCancelEdit} className="ml-2 bg-gray-300 px-4 py-2 rounded hover:bg-gray-400">
                Cancel Edit
              </button>
            )}
          </form>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">City Statistics</h2>
          <Bar data={cityData} options={options} />
        </div>
      </div>
      <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">City Admins</h2>
        <div className="space-y-4">
          {cityAdmins.map(admin => (
            <div key={admin.id} className="flex justify-between items-center p-4 bg-gray-100 rounded-lg">
              <div>
                <h3 className="font-semibold">{admin.name}</h3>
                <p className="text-sm text-gray-600">City: {admin.city}</p>
              </div>
              <div>
                <button onClick={() => handleEdit(admin)} className="bg-blue-500 text-white px-3 py-1 rounded mr-2 hover:bg-blue-600">Edit</button>
                <button onClick={() => handleDelete(admin.id)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;

