import React, { useState } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';

function LocationPicker({ setCoords }) {
  useMapEvents({
    click(e) {
      setCoords({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return null;
}

export default function RegisterLand() {
  const [form, setForm] = useState({
    surveyNumber: '', ownerName: '', area: '',
    address: '', district: '', state: '', pincode: ''
  });
  const [coords, setCoords] = useState(null);
  const [file, setFile] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('surveyNumber', form.surveyNumber);
    data.append('ownerName', form.ownerName);
    data.append('area', form.area);
    data.append('location', JSON.stringify({
      address: form.address, district: form.district,
      state: form.state, pincode: form.pincode, coordinates: coords
    }));
    data.append('sensitiveDetails', JSON.stringify({ ownerName: form.ownerName }));
    if (file) data.append('fmbSketch', file);

    try {
      const res = await axios.post('http://localhost:5000/api/land/register', data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      alert('✅ Land registered on blockchain!\nBlock Hash: ' + res.data.block.hash);
    } catch (err) {
      alert(err.response?.data?.error || 'Error');
    }
  };

  // Stringify location field for FormData
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('surveyNumber', form.surveyNumber);
    formData.append('ownerName', form.ownerName);
    formData.append('area', form.area);
    const locationObj = {
      address: form.address, district: form.district,
      state: form.state, pincode: form.pincode, coordinates: coords
    };
    Object.keys(locationObj).forEach(k => {
      if (k === 'coordinates' && coords) {
        formData.append('location[coordinates][lat]', coords.lat);
        formData.append('location[coordinates][lng]', coords.lng);
      } else {
        formData.append(`location[${k}]`, locationObj[k]);
      }
    });
    if (file) formData.append('fmbSketch', file);

    axios.post('http://localhost:5000/api/land/register', formData, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).then(res => alert('✅ Land registered! Block: ' + res.data.block.hash))
      .catch(err => alert(err.response?.data?.error || 'Error'));
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">📝 Register New Land</h2>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow space-y-3">
        <input className="border p-2 w-full" placeholder="Survey Number" onChange={e => setForm({ ...form, surveyNumber: e.target.value })} required />
        <input className="border p-2 w-full" placeholder="Owner Name" onChange={e => setForm({ ...form, ownerName: e.target.value })} required />
        <input className="border p-2 w-full" type="number" placeholder="Area (sq.ft)" onChange={e => setForm({ ...form, area: e.target.value })} required />
        <input className="border p-2 w-full" placeholder="Address" onChange={e => setForm({ ...form, address: e.target.value })} />
        <div className="grid grid-cols-3 gap-2">
          <input className="border p-2" placeholder="District" onChange={e => setForm({ ...form, district: e.target.value })} />
          <input className="border p-2" placeholder="State" onChange={e => setForm({ ...form, state: e.target.value })} />
          <input className="border p-2" placeholder="Pincode" onChange={e => setForm({ ...form, pincode: e.target.value })} />
        </div>
        <div>
          <label className="font-bold">📍 Click on map to set location</label>
          <MapContainer center={[11.0168, 76.9558]} zoom={13} style={{ height: '300px' }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <LocationPicker setCoords={setCoords} />
            {coords && <Marker position={[coords.lat, coords.lng]} />}
          </MapContainer>
          {coords && <p className="text-sm text-gray-600 mt-1">Lat: {coords.lat.toFixed(5)}, Lng: {coords.lng.toFixed(5)}</p>}
        </div>
        <div>
          <label className="font-bold">📄 Upload FMB Sketch (stored on IPFS)</label>
          <input type="file" onChange={e => setFile(e.target.files[0])} className="border p-2 w-full" />
        </div>
        <button className="bg-green-700 text-white p-3 rounded w-full font-bold">Register on Blockchain</button>
      </form>
    </div>
  );
}