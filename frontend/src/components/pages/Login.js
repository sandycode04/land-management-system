import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', form);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div className="flex justify-center mt-20">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-4">Login</h2>
        <input type="email" placeholder="Email" className="border p-2 w-full mb-3"
          onChange={e => setForm({ ...form, email: e.target.value })} required />
        <input type="password" placeholder="Password" className="border p-2 w-full mb-3"
          onChange={e => setForm({ ...form, password: e.target.value })} required />
        <button className="bg-green-700 text-white p-2 w-full rounded">Login</button>
        <p className="mt-3 text-sm">No account? <Link to="/register" className="text-blue-600">Register</Link></p>
      </form>
    </div>
  );
}