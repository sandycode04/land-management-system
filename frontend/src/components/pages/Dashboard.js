import React, { useEffect, useState } from 'react';
import axios from 'axios';
import MapView from '../components/MapView';

export default function Dashboard() {
  const [lands, setLands] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    axios.get('http://localhost:5000/api/land/all', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setLands(res.data));
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-4">🗺️ Land Registry Dashboard</h2>
      <MapView lands={lands} />
      <div className="grid grid-cols-3 gap-4 mt-6">
        {lands.map(land => (
          <div key={land._id} className="bg-white p-4 rounded shadow">
            <h3 className="font-bold">Survey #{land.surveyNumber}</h3>
            <p>Owner: {land.ownerName}</p>
            <p>Area: {land.area} sq.ft</p>
            <p>Status: <span className={`px-2 py-1 rounded text-xs ${land.status === 'verified' ? 'bg-green-200' : 'bg-yellow-200'}`}>{land.status}</span></p>
            <p className="text-xs text-gray-500 truncate">Hash: {land.blockchainTxHash}</p>
            {land.fmbSketchCID && (
              <a href={`http://localhost:5000/api/ipfs/${land.fmbSketchCID}`} target="_blank" rel="noreferrer" className="text-blue-600 text-sm">View FMB Sketch</a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}