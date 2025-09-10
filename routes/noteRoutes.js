const express = require('express');
const router = express.Router();
const { jwtCheck, attachUser } = require('../middleware/auth')
const uploadCtrl = require('../controllers/uploadController');
const notesCtrl = require('../controllers/notesController'); 

// Upload
router.post('/upload-signature', jwtCheck, uploadCtrl.getUploadSignature);
router.post('/notes', jwtCheck, attachUser, notesCtrl.createNote)

// Notes (view only)
router.get('/notes', jwtCheck, attachUser, notesCtrl.listNotes);
router.get('/notes/:id', jwtCheck, attachUser, notesCtrl.getNote);

module.exports = router;