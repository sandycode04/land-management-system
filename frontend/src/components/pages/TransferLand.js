import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function TransferLand() {
  const [lands, setLands] = useState([]);
  const [toUserId, setToUserId] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    axios.get('http://localhost:5000/api/land/mine', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setLands(res.data));
  }, []);

  const transfer = async (id) => {
    if (!toUserId) return alert('Enter recipient User ID');
    try {
      const res = await axios.post(`http://localhost:5000/api/land/transfer/${id}`,
        { toUserId },
        { headers: { Authorization: `Bearer ${token}` } });
      alert('✅ Land transferred! Block: ' + res.data.block.hash);
    } catch (err) {
      alert(err.response?.data?.error || 'Error');
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">🔄 Transfer Land Ownership</h2>
      <input className="border p-2 w-full mb-4" placeholder="Recipient User ID (MongoDB _id)"
        value={toUserId} onChange={e => setToUserId(e.target.value)} />
      <div className="grid grid-cols-2 gap-4">
        {lands.map(land => (
          <div key={land._id} className="bg-white p-4 rounded shadow">
            <h3 className="font-bold">Survey #{land.surveyNumber}</h3>
            <p>Area: {land.area} sq.ft</p>
            <p>Status: {land.status}</p>
            <button onClick={() => transfer(land._id)} className="bg-orange-600 text-white px-4 py-2 mt-2 rounded">
              Transfer
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}