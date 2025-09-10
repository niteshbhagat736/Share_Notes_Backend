const Note = require('../models/Note')
const User = require('../models/User')
const crypto = require('crypto')
const cloudinary = require('cloudinary').v2



exports.getUploadSignature = async (req, res) => {
  const timestamp = Math.round(new Date().getTime() / 1000);
  const signature = cloudinary.utils.api_sign_request(
    { timestamp, folder: 'notes' },
    process.env.CLOUD_API_SECRET
  );
  res.json({
    cloudName: process.env.CLOUD_NAME,
    apiKey: process.env.CLOUD_API_KEY,
    timestamp,
    signature,
  });
};