// routes/upload.js
const cloudinary = require('cloudinary').v2;
const express = require('express');
const router = express.Router();
const jwtCheck = require('../middleware/auth'); // Auth0 check

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET
});

// Request signed params
router.post('/upload-signature', jwtCheck, (req, res) => {
  const timestamp = Math.round((new Date).getTime()/1000);
  const signature = cloudinary.utils.api_sign_request(
    { timestamp, folder: "notes" }, 
    process.env.CLOUD_API_SECRET
  );

  res.json({
    cloudName: process.env.CLOUD_NAME,
    apiKey: process.env.CLOUD_API_KEY,
    timestamp,
    signature
  });
});

module.exports = router;
