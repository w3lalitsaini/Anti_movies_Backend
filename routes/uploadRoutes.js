const express = require('express');
const router = express.Router();
const { upload } = require('../configs/cloudinary');
const { protect } = require('../middlewares/auth');

// Upload single image (poster, actor photo, etc.)
router.post('/image', protect, (req, res) => {
    upload.single('image')(req, res, (err) => {
        if (err) {
            console.error('Multer/Cloudinary error:', err);
            return res.status(400).json({ message: err.message || 'Upload failed' });
        }
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded. Make sure the field name is "image".' });
        }
        res.json({
            url: req.file.path,
            public_id: req.file.filename,
        });
    });
});

// Upload multiple images (screenshots)
router.post('/images', protect, (req, res) => {
    upload.array('images', 10)(req, res, (err) => {
        if (err) {
            console.error('Multer/Cloudinary error:', err);
            return res.status(400).json({ message: err.message || 'Upload failed' });
        }
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: 'No files uploaded. Make sure the field name is "images".' });
        }
        const urls = req.files.map(f => f.path);
        res.json({ urls });
    });
});

module.exports = router;
