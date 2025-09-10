const mongoose = require('mongoose')

const NoteSchema = new mongoose.Schema({
  title: String,
  publicId: String,
  url: String,
  mimeType: String,
  size: Number,
  uploader: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isPublic: { type: Boolean, default: false },
  allowedEmails: [{ type: String }],
  createdAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Note', NoteSchema)