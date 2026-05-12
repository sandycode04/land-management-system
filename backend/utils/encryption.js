const CryptoJS = require('crypto-js');
const crypto = require('crypto');

const AES_SECRET = process.env.AES_SECRET || 'default_secret';

// AES Encryption
exports.encryptData = (data) => {
  return CryptoJS.AES.encrypt(JSON.stringify(data), AES_SECRET).toString();
};

exports.decryptData = (cipher) => {
  const bytes = CryptoJS.AES.decrypt(cipher, AES_SECRET);
  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
};

// SHA-256 Hashing
exports.hashData = (data) => {
  return crypto
    .createHash('sha256')
    .update(JSON.stringify(data))
    .digest('hex');
};