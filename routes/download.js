// routes/download.js
router.get('/download/:publicId', jwtCheck, async (req, res) => {
  const { publicId } = req.params;

  // TODO: check MongoDB for user permission

  const url = cloudinary.utils.private_download_url(
    publicId, "pdf", { expires_at: Math.floor(Date.now()/1000) + 60 } // expires in 60s
  );

  res.json({ url });
});
