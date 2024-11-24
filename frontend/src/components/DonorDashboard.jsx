import React, { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import Layout from './Layout';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const DonorDashboard = () => {
  const [posts, setPosts] = useState([
    { id: 1, title: 'Fresh Vegetables', description: 'Assorted fresh vegetables', quantity: '10 kg' },
    { id: 2, title: 'Canned Goods', description: 'Various canned foods', quantity: '20 cans' },
  ]);

  const [newPost, setNewPost] = useState({ title: '', description: '', quantity: '' });
  const [editingPost, setEditingPost] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (editingPost) {
      setEditingPost({ ...editingPost, [name]: value });
    } else {
      setNewPost({ ...newPost, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingPost) {
      setPosts(posts.map(post => post.id === editingPost.id ? editingPost : post));
      setEditingPost(null);
    } else {
      setPosts([...posts, { ...newPost, id: Date.now() }]);
      setNewPost({ title: '', description: '', quantity: '' });
    }
  };

  const handleEdit = (post) => {
    setEditingPost(post);
  };

  const handleDelete = (id) => {
    setPosts(posts.filter(post => post.id !== id));
  };

  const handleCancelEdit = () => {
    setEditingPost(null);
  };

  const donationData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Donations',
        data: [4, 3, 2, 6, 8, 5],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
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
        text: 'Monthly Donations',
      },
    },
  };

  return (
    <Layout title="Donor Dashboard">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">{editingPost ? 'Edit Post' : 'Create New Post'}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              className="w-full p-2 border rounded"
              placeholder="Title"
              name="title"
              value={editingPost ? editingPost.title : newPost.title}
              onChange={handleInputChange}
              required
            />
            <textarea
              className="w-full p-2 border rounded"
              placeholder="Description"
              name="description"
              value={editingPost ? editingPost.description : newPost.description}
              onChange={handleInputChange}
              required
            />
            <input
              className="w-full p-2 border rounded"
              placeholder="Quantity"
              name="quantity"
              value={editingPost ? editingPost.quantity : newPost.quantity}
              onChange={handleInputChange}
              required
            />
            <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
              {editingPost ? 'Update Post' : 'Create Post'}
            </button>
            {editingPost && (
              <button type="button" onClick={handleCancelEdit} className="ml-2 bg-gray-300 px-4 py-2 rounded hover:bg-gray-400">
                Cancel Edit
              </button>
            )}
          </form>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Donation History</h2>
          <Bar data={donationData} options={options} />
        </div>
      </div>
      <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Your Posts</h2>
        <div className="space-y-4">
          {posts.map(post => (
            <div key={post.id} className="flex justify-between items-center p-4 bg-gray-100 rounded-lg">
              <div>
                <h3 className="font-semibold">{post.title}</h3>
                <p className="text-sm text-gray-600">{post.description}</p>
                <p className="text-sm text-gray-600">Quantity: {post.quantity}</p>
              </div>
              <div>
                <button onClick={() => handleEdit(post)} className="bg-blue-500 text-white px-3 py-1 rounded mr-2 hover:bg-blue-600">Edit</button>
                <button onClick={() => handleDelete(post.id)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default DonorDashboard;

