const express = require('express');
const router = express.Router();
const { jwtCheck, attachUser } = require('../middleware/auth')
const uploadCtrl = require('../controllers/uploadController');
const notesCtrl = require('../controllers/notesController'); 

// Upload
router.post('/upload-signature', jwtCheck, uploadCtrl.getUploadSignature);
router.post('/notes', jwtCheck, attachUser, notesCtrl.createNote)
router.get("/my-notes", jwtCheck, attachUser, notesCtrl.myNotes);
router.put("/notes/:id", jwtCheck, attachUser, notesCtrl.updateNote);
router.delete("/notes/:id", jwtCheck, attachUser, notesCtrl.deleteNote);


// Notes (view only)
router.get('/notes', jwtCheck, attachUser, notesCtrl.listNotes);
router.get('/notes/:id', jwtCheck, attachUser, notesCtrl.getNote);

module.exports = router;
