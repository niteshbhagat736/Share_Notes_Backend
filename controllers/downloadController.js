
const cloudinary = require('cloudinary').v2;
const Note = require('../models/Note');

exports.getDownloadUrl = async (req, res) => {
  try {
    const { id } = req.params;
    const auth0Id = req.auth.payload.sub;

    const note = await Note.findById(id);
    if (!note) return res.status(404).json({ error: "Note not found" });

    // Permission check (basic: owner only, extend later for sharing)
    if (note.ownerAuth0Id !== auth0Id) {
      return res.status(403).json({ error: "Not authorized to download this file" });
    }

    const url = cloudinary.utils.private_download_url(
      note.cloudinaryPublicId,
      "pdf", // or "auto" for any type
      { expires_at: Math.floor(Date.now() / 1000) + 60 } // expires in 60s
    );

    res.json({ url });
  } catch (err) {
    console.error("Download error:", err);
    res.status(500).json({ error: "Failed to generate download URL" });
  }
};
