// Multi-Level Verification Middleware
const Land = require('../models/Land');

exports.requireFullVerification = async (req, res, next) => {
  try {
    const land = await Land.findById(req.params.id || req.body.landId);
    if (!land) return res.status(404).json({ error: 'Land not found' });

    const { level1, level2, level3 } = land.verificationStatus;
    if (!level1 || !level2 || !level3) {
      return res.status(403).json({
        error: 'Land has not passed all 3 verification levels',
        status: land.verificationStatus,
      });
    }
    req.land = land;
    next();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.requireRole = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    next();
  };
};