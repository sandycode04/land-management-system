import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function BlockchainExplorer() {
  const [chain, setChain] = useState([]);
  const [valid, setValid] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:5000/api/blockchain/chain')
      .then(res => {
        setChain(res.data.chain);
        setValid(res.data.isValid);
      });
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">⛓️ Blockchain Explorer</h2>
      <p className="mb-4">Chain Status: <span className={valid ? 'text-green-700 font-bold' : 'text-red-700'}>{valid ? '✅ Valid' : '❌ Tampered'}</span></p>
      <div className="space-y-3">
        {chain.map((block, i) => (
          <div key={i} className="bg-white p-4 rounded shadow border-l-4 border-green-700">
            <p><b>Block #{block.index}</b></p>
            <p className="text-xs">Hash: <span className="text-green-700">{block.hash}</span></p>
            <p className="text-xs">Previous: {block.previousHash}</p>
            <p className="text-xs">Timestamp: {new Date(block.timestamp).toLocaleString()}</p>
            <p className="text-xs">Nonce: {block.nonce}</p>
            <pre className="bg-gray-100 p-2 mt-2 text-xs overflow-x-auto">{JSON.stringify(block.data, null, 2)}</pre>
          </div>
        ))}
      </div>
    </div>
  );
}