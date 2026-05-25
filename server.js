const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { nanoid } = require('nanoid');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log('DB Connection Error:', err));

// URL Schema
const urlSchema = new mongoose.Schema({
  longUrl: String,
  shortCode: String,
  clicks: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});
const Url = mongoose.model('Url', urlSchema);

// API: Shorten URL
app.post('/api/shorten', async (req, res) => {
  const { longUrl } = req.body;
  if (!longUrl) return res.status(400).json({ error: 'URL is required' });

  try {
    let url = await Url.findOne({ longUrl });
    if (url) return res.json(url);

    const shortCode = nanoid(6);
    url = new Url({ longUrl, shortCode });
    await url.save();
    res.json(url);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Redirect Short URL
app.get('/:code', async (req, res) => {
  try {
    const url = await Url.findOne({ shortCode: req.params.code });
    if (url) {
      url.clicks++;
      await url.save();
      return res.redirect(url.longUrl);
    }
    return res.status(404).send('URL not found');
  } catch (error) {
    res.status(500).send('Server error');
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
