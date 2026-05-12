    import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import RegisterLand from './pages/RegisterLand';
import VerifyLand from './pages/VerifyLand';
import TransferLand from './pages/TransferLand';
import BlockchainExplorer from './pages/BlockchainExplorer';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/register-land" element={<PrivateRoute><RegisterLand /></PrivateRoute>} />
        <Route path="/verify" element={<PrivateRoute><VerifyLand /></PrivateRoute>} />
        <Route path="/transfer" element={<PrivateRoute><TransferLand /></PrivateRoute>} />
        <Route path="/blockchain" element={<PrivateRoute><BlockchainExplorer /></PrivateRoute>} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;