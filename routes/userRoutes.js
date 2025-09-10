const express = require('express')
const router = express.Router()
const { jwtCheck } = require('../middleware/auth')
const User = require('../models/User')
const Note = require('../models/Note')

// Get current user profile + note count
router.get('/me', jwtCheck, async (req, res) => {
  try {
    const auth0Id = req.auth.payload.sub
    let user = await User.findOne({ auth0Id })
    if (!user) {
      user = await User.create({
        auth0Id,
        email: req.auth.payload.email,
        name: req.auth.payload.name
      })
    }
    const noteCount = await Note.countDocuments({ uploader: user._id })
    res.json({ user, noteCount })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to load profile' })
  }
})

// Update profile
// Update profile
router.put('/me', jwtCheck, async (req, res) => {
  try {
    const auth0Id = req.auth.payload.sub
    const update = {}

    // only apply fields that are defined
    if (req.body.name) update.name = req.body.name
    if (req.body.role) update.role = req.body.role
    if (req.body.profilePic !== undefined) update.profilePic = req.body.profilePic

    const user = await User.findOneAndUpdate(
      { auth0Id },
      { $set: update },
      { new: true }
    )

    res.json({ user })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to update profile' })
  }
})

module.exports = router
