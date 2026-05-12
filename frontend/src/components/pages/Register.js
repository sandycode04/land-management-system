import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [form, setForm] = useState({
    name: '', email: '', password: '', aadhaar: '', phone: '', role: 'user'
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', form);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <div className="flex justify-center mt-10">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-4">Register</h2>
        <input placeholder="Name" className="border p-2 w-full mb-2" onChange={e => setForm({ ...form, name: e.target.value })} required />
        <input type="email" placeholder="Email" className="border p-2 w-full mb-2" onChange={e => setForm({ ...form, email: e.target.value })} required />
        <input type="password" placeholder="Password" className="border p-2 w-full mb-2" onChange={e => setForm({ ...form, password: e.target.value })} required />
        <input placeholder="Aadhaar Number" className="border p-2 w-full mb-2" onChange={e => setForm({ ...form, aadhaar: e.target.value })} required />
        <input placeholder="Phone" className="border p-2 w-full mb-2" onChange={e => setForm({ ...form, phone: e.target.value })} required />
        <select className="border p-2 w-full mb-3" onChange={e => setForm({ ...form, role: e.target.value })}>
          <option value="user">User (Land Owner)</option>
          <option value="verifier">Verifier</option>
          <option value="registrar">Registrar</option>
          <option value="admin">Admin</option>
        </select>
        <button className="bg-green-700 text-white p-2 w-full rounded">Register</button>
      </form>
    </div>
  );
}