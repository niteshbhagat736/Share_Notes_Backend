const Note = require('../models/Note')

async function checkNoteAccess(req, res, next) {
  try {
    const note = await Note.findById(req.params.id).populate('uploader')
    if (!note) return res.status(404).json({ error: 'Note not found' })

    const user = req.user

    // Public notes → all logged-in users
    if (note.isPublic) return next()

    // Uploader always has access
    if (note.uploader?.email === user.email) return next()

    // If user email is in allowedEmails
    if (note.allowedEmails && note.allowedEmails.includes(user.email)) return next()

    return res.status(403).json({ error: 'Access denied' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Authorization check failed' })
  }
}

module.exports = checkNoteAccess