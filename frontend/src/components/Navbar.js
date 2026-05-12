import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const logout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <nav className="bg-green-700 text-white p-4 flex justify-between items-center shadow-lg">
      <h1 className="text-xl font-bold">🏞️ Blockchain Land Registry</h1>
      <div className="flex gap-4 items-center">
        {token ? (
          <>
            <Link to="/" className="hover:underline">Dashboard</Link>
            <Link to="/register-land" className="hover:underline">Register Land</Link>
            <Link to="/verify" className="hover:underline">Verify</Link>
            <Link to="/transfer" className="hover:underline">Transfer</Link>
            <Link to="/blockchain" className="hover:underline">Blockchain</Link>
            <span className="bg-green-900 px-3 py-1 rounded">{user.name} ({user.role})</span>
            <button onClick={logout} className="bg-red-600 px-3 py-1 rounded">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}