const express = require('express');
const router = express.Router();
const { getFromIPFS } = require('../utils/ipfsUtil');

router.get('/:cid', (req, res) => {
  const data = getFromIPFS(req.params.cid);
  if (!data) return res.status(404).json({ error: 'File not found' });
  res.send(data);
});

module.exports = router;