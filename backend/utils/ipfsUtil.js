// Simulated IPFS storage (local) - replace with real IPFS in production
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const IPFS_DIR = path.join(__dirname, '../ipfs_storage');
if (!fs.existsSync(IPFS_DIR)) fs.mkdirSync(IPFS_DIR, { recursive: true });

exports.uploadToIPFS = async (fileBuffer, filename) => {
  const hash = crypto.createHash('sha256').update(fileBuffer).digest('hex');
  const cid = `Qm${hash.substring(0, 44)}`; // Simulated CID
  const filePath = path.join(IPFS_DIR, cid);
  fs.writeFileSync(filePath, fileBuffer);
  return { cid, path: filePath };
};

exports.getFromIPFS = (cid) => {
  const filePath = path.join(IPFS_DIR, cid);
  if (fs.existsSync(filePath)) {
    return fs.readFileSync(filePath);
  }
  return null;
};