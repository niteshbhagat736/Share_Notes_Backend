const Note = require('../models/Note');
const User = require('../models/User');

exports.listNotes = async (req, res) => {
  try {
    const userEmail = req.user?.email
    if (!userEmail) return res.status(401).json({ error: "Unauthorized" })

    const notes = await Note.find({
      $or: [
        { isPublic: true },
        { allowedEmails: userEmail }
      ]
    })
      .populate("uploader", "name email profilePic role")
      .sort({ createdAt: -1 })

    res.json({ notes })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Failed to fetch notes" })
  }
}

exports.getNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id).populate("uploader", "name email profilePic role");
    if (!note) return res.status(404).json({ error: "Note not found" });

    const userEmail = req.user?.email;


    if (
      !note.isPublic &&
      (!note.allowedEmails || !note.allowedEmails.includes(userEmail)) &&
      note.uploader?.email !== userEmail
    ) {
      return res.status(403).json({ error: "You do not have access to this note" });
    }

    // return note content but not download URL
    res.json(note);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to get note" });
  }
};


exports.createNote = async (req, res) => {
  try {
    const { title, publicId, url, mimeType, size, isPublic, allowedEmails = [] } = req.body
    console.log('Received allowedEmails:', allowedEmails)
    console.log('Received url:', url)

    if (!req.user?.auth0Id) {
      return res.status(401).json({ error: "Unauthorized" })
    }

    let user = await User.findOne({ auth0Id: req.user.auth0Id })
    if (!user) {
      user = await User.create({
        auth0Id: req.user.auth0Id,
        email: req.user.email || "unknown@example.com",
        name: req.user.name || "Unnamed User"
      })
    }

    const note = await Note.create({
      title,
      publicId,
      url,
      mimeType,
      size,
      uploader: user._id,
      isPublic,
      allowedEmails
    })

    res.json(note)
  } catch (err) {
    console.error("Error in createNote:", err)
    res.status(500).json({ error: "Failed to save note" })
  }
}



exports.myNotes = async (req, res) => {
  const auth0Id = req.user?.auth0Id
  if (!auth0Id) return res.status(401).json({ error: "Unauthorized" })
  const user = await User.findOne({ auth0Id })
  const notes = await Note.find({ uploader: user._id }).sort({ createdAt: -1 })
  res.json({ notes })
}

exports.updateNote = async (req, res) => {
  const { id } = req.params
  const { title } = req.body
  const auth0Id = req.user?.auth0Id
  const user = await User.findOne({ auth0Id })
  const note = await Note.findOneAndUpdate(
    { _id: id, uploader: user._id },
    { title },
    { new: true }
  )
  if (!note) return res.status(404).json({ error: "Not found or unauthorized" })
  res.json(note)
}

exports.deleteNote = async (req, res) => {
  const { id } = req.params
  const auth0Id = req.user?.auth0Id
  const user = await User.findOne({ auth0Id })
  const note = await Note.findOneAndDelete({ _id: id, uploader: user._id })
  if (!note) return res.status(404).json({ error: "Not found or unauthorized" })
  res.json({ success: true })
}
