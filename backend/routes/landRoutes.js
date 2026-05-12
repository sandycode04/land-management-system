const express = require('express');
const router = express.Router();
const multer = require('multer');
const auth = require('../middleware/auth');
const { requireRole } = require('../middleware/multiLevelVerify');
const {
  registerLand,
  getAllLands,
  getMyLands,
  verifyLand,
  transferLand,
} = require('../controllers/landController');

const upload = multer({ storage: multer.memoryStorage() });

router.post('/register', auth, upload.single('fmbSketch'), (req, res, next) => {
  if (req.file) {
    req.files = { fmbSketch: { data: req.file.buffer, name: req.file.originalname } };
  }
  next();
}, registerLand);

router.get('/all', auth, getAllLands);
router.get('/mine', auth, getMyLands);
router.post('/verify/:id', auth, requireRole('verifier', 'admin', 'registrar'), verifyLand);
router.post('/transfer/:id', auth, transferLand);

module.exports = router;