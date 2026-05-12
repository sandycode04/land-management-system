import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function VerifyLand() {
  const [lands, setLands] = useState([]);
  const token = localStorage.getItem('token');

  const load = () => {
    axios.get('http://localhost:5000/api/land/all', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setLands(res.data));
  };

  useEffect(load, []);

  const verify = async (id, level) => {
    try {
      await axios.post(`http://localhost:5000/api/land/verify/${id}`,
        { level },
        { headers: { Authorization: `Bearer ${token}` } });
      alert(`✅ Level ${level} verified!`);
      load();
    } catch (err) {
      alert(err.response?.data?.error || 'Error');
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">🔍 Multi-Level Verification</h2>
      <div className="grid grid-cols-2 gap-4">
        {lands.map(land => (
          <div key={land._id} className="bg-white p-4 rounded shadow">
            <h3 className="font-bold">Survey #{land.surveyNumber}</h3>
            <p>Owner: {land.ownerName}</p>
            <div className="mt-2 space-y-1">
              <p>Level 1 (Documents): {land.verificationStatus.level1 ? '✅' : '❌'}</p>
              <p>Level 2 (Survey): {land.verificationStatus.level2 ? '✅' : '❌'}</p>
              <p>Level 3 (Registrar): {land.verificationStatus.level3 ? '✅' : '❌'}</p>
            </div>
            <div className="flex gap-2 mt-3">
              <button onClick={() => verify(land._id, 1)} className="bg-blue-500 text-white px-3 py-1 rounded">L1</button>
              <button onClick={() => verify(land._id, 2)} className="bg-blue-600 text-white px-3 py-1 rounded">L2</button>
              <button onClick={() => verify(land._id, 3)} className="bg-blue-700 text-white px-3 py-1 rounded">L3</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}