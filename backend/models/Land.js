const mongoose = require('mongoose');

const LandSchema = new mongoose.Schema({
  surveyNumber: { type: String, required: true, unique: true },
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  ownerName: String,
  area: Number, // in sq ft
  location: {
    address: String,
    district: String,
    state: String,
    pincode: String,
    coordinates: {
      lat: Number,
      lng: Number,
    },
  },
  boundaries: [{ lat: Number, lng: Number }], // Polygon for GIS
  fmbSketchCID: String, // IPFS CID for FMB sketch
  documentCIDs: [String], // IPFS CIDs for legal docs
  encryptedDetails: String, // AES encrypted sensitive data
  dataHash: String, // SHA-256 hash for integrity
  blockchainTxHash: String, // Hash of block storing this record
  verificationStatus: {
    level1: { type: Boolean, default: false }, // Document verify
    level2: { type: Boolean, default: false }, // Surveyor verify
    level3: { type: Boolean, default: false }, // Registrar verify
  },
  status: {
    type: String,
    enum: ['pending', 'verified', 'rejected', 'transferred'],
    default: 'pending',
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Land', LandSchema);