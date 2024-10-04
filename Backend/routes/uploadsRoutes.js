const express = require('express');
const { uploadDocument } = require('../controllers/uploadController');
const multer = require('multer');

const router = express.Router();

// Multer configuration to handle file uploads
const upload = multer({ dest: 'uploads/' });

// Upload route
router.post('/upload', upload.single('document'), uploadDocument);

module.exports = router;
