const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  landId: { type: mongoose.Schema.Types.ObjectId, ref: 'Land' },
  fromUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  toUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  type: {
    type: String,
    enum: ['registration', 'transfer', 'verification', 'update'],
  },
  blockHash: String,
  previousHash: String,
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Transaction', TransactionSchema);