const Land = require('../models/Land');
const Transaction = require('../models/Transaction');
const blockchain = require('../blockchain/Blockchain');
const { encryptData, decryptData, hashData } = require('../utils/encryption');
const { uploadToIPFS } = require('../utils/ipfsUtil');

// Register Land
exports.registerLand = async (req, res) => {
  try {
    const {
      surveyNumber,
      ownerName,
      area,
      location,
      boundaries,
      sensitiveDetails,
    } = req.body;

    // Encrypt sensitive details (AES)
    const encryptedDetails = encryptData(sensitiveDetails || {});

    // FMB sketch upload to IPFS
    let fmbCID = null;
    if (req.files && req.files.fmbSketch) {
      const result = await uploadToIPFS(
        req.files.fmbSketch.data,
        req.files.fmbSketch.name
      );
      fmbCID = result.cid;
    }

    // Hash data using SHA-256
    const dataToHash = { surveyNumber, ownerName, area, location };
    const dataHash = hashData(dataToHash);

    const land = await Land.create({
      surveyNumber,
      ownerId: req.user.id,
      ownerName,
      area,
      location,
      boundaries,
      fmbSketchCID: fmbCID,
      encryptedDetails,
      dataHash,
    });

    // Add to Blockchain
    const block = blockchain.addBlock({
      type: 'LAND_REGISTRATION',
      landId: land._id,
      surveyNumber,
      ownerId: req.user.id,
      dataHash,
      ipfsCID: fmbCID,
      timestamp: Date.now(),
    });

    land.blockchainTxHash = block.hash;
    await land.save();

    await Transaction.create({
      landId: land._id,
      toUser: req.user.id,
      type: 'registration',
      blockHash: block.hash,
      previousHash: block.previousHash,
    });

    res.json({ message: '✅ Land registered & added to blockchain', land, block });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all lands
exports.getAllLands = async (req, res) => {
  try {
    const lands = await Land.find().populate('ownerId', 'name email');
    res.json(lands);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get my lands
exports.getMyLands = async (req, res) => {
  try {
    const lands = await Land.find({ ownerId: req.user.id });
    res.json(lands);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Verify Land (Multi-level)
exports.verifyLand = async (req, res) => {
  try {
    const { level } = req.body;
    const land = await Land.findById(req.params.id);
    if (!land) return res.status(404).json({ error: 'Land not found' });

    if (level === 1) land.verificationStatus.level1 = true;
    if (level === 2) land.verificationStatus.level2 = true;
    if (level === 3) {
      land.verificationStatus.level3 = true;
      land.status = 'verified';
    }
    await land.save();

    const block = blockchain.addBlock({
      type: 'VERIFICATION',
      landId: land._id,
      level,
      verifier: req.user.id,
      timestamp: Date.now(),
    });

    res.json({ message: `Level ${level} verification done`, land, block });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Transfer Land
exports.transferLand = async (req, res) => {
  try {
    const { toUserId } = req.body;
    const land = await Land.findById(req.params.id);
    if (!land) return res.status(404).json({ error: 'Land not found' });

    if (land.ownerId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not the owner' });
    }

    const previousOwner = land.ownerId;
    land.ownerId = toUserId;
    land.status = 'transferred';
    await land.save();

    const block = blockchain.addBlock({
      type: 'TRANSFER',
      landId: land._id,
      from: previousOwner,
      to: toUserId,
      timestamp: Date.now(),
    });

    await Transaction.create({
      landId: land._id,
      fromUser: previousOwner,
      toUser: toUserId,
      type: 'transfer',
      blockHash: block.hash,
    });

    res.json({ message: 'Land transferred', land, block });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};