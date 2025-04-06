const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static frontend files
app.use(express.static(path.join(__dirname, '../FrontEnd')));

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Save files to uploads folder
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + file.originalname;
    cb(null, uniqueSuffix);
  }
});
const upload = multer({ storage });

// MongoDB models
const Donation = mongoose.model('Donation', new mongoose.Schema({
  foodName: String,
  quantity: Number,
  pickupTime: Date,
  bestBefore: Date,
  location: String,
  contact: String,
  documentType: String,
  documentPath: String,
}, { timestamps: true }));

const Request = mongoose.model('Request', new mongoose.Schema({
  requesterName: String,
  neededQuantity: Number,
  requestLocation: String,
  requestContact: String,
  documentType: String,
  documentPath: String,
}, { timestamps: true }));

// API Routes

// Submit a Donation
app.post('/api/donate', upload.single('document'), async (req, res) => {
  try {
    console.log("Donation Request Body:", req.body);
    console.log("Uploaded File:", req.file);

    const {
      foodName,
      quantity,
      pickupTime,
      bestBefore,
      location,
      contact,
      documentType
    } = req.body;

    const donation = new Donation({
      foodName,
      quantity,
      pickupTime,
      bestBefore,
      location,
      contact,
      documentType,
      documentPath: req.file ? req.file.path : null
    });

    await donation.save();
    res.status(200).json({ message: 'Donation submitted successfully!' });
  } catch (err) {
    console.error('Error submitting donation:', err);
    res.status(500).json({ error: 'Failed to submit donation' });
  }
});

// Submit a Request
app.post('/api/request', upload.single('document'), async (req, res) => {
  try {
    console.log("Request Form Body:", req.body);
    console.log("Uploaded File:", req.file);

    const {
      requesterName,
      neededQuantity,
      requestLocation,
      requestContact,
      documentType
    } = req.body;

    const requestData = new Request({
      requesterName,
      neededQuantity,
      requestLocation,
      requestContact,
      documentType,
      documentPath: req.file ? req.file.path : null
    });

    await requestData.save();
    res.status(200).json({ message: 'Food request submitted successfully!' });
  } catch (err) {
    console.error('Error submitting request:', err);
    res.status(500).json({ error: 'Failed to submit request' });
  }
});

// View All Donations
app.get('/api/donations', async (req, res) => {
  try {
    const donations = await Donation.find().sort({ createdAt: -1 });
    res.status(200).json(donations);
  } catch (err) {
    console.error('Error fetching donations:', err);
    res.status(500).json({ error: 'Error fetching donations' });
  }
});

// View All Requests
app.get('/api/requests', async (req, res) => {
  try {
    const requests = await Request.find().sort({ createdAt: -1 });
    res.status(200).json(requests);
  } catch (err) {
    console.error('Error fetching requests:', err);
    res.status(500).json({ error: 'Error fetching requests' });
  }
});

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log('✅ Connected to MongoDB Atlas');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ Failed to connect to MongoDB:', err);
  });
