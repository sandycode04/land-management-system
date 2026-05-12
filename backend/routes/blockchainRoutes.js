const express = require('express');
const router = express.Router();
const blockchain = require('../blockchain/Blockchain');

router.get('/chain', (req, res) => {
  res.json({
    chain: blockchain.chain,
    length: blockchain.chain.length,
    isValid: blockchain.isChainValid(),
  });
});

router.get('/validate', (req, res) => {
  res.json({ valid: blockchain.isChainValid() });
});

module.exports = router;