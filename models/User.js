const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
  auth0Id: { type: String, required: true, unique: true },
  email: { type: String},
  name: String,
role: { type: String, enum: ['student','teacher','institute'], default: 'student' },


  profilePic: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('User', UserSchema)
