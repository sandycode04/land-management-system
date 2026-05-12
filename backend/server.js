const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const path = require('path');

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/land', require('./routes/landRoutes'));
app.use('/api/blockchain', require('./routes/blockchainRoutes'));
app.use('/api/ipfs', require('./routes/ipfsRoutes'));

app.get('/', (req, res) => {
  res.send('🏞️ Blockchain Land Management System API Running');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));