const multer = require('multer');
const path = require('path');

// Configure storage for CVs (documents)
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'private/cvs'); // Store CVs in a private, non-public folder
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'cv-' + uniqueSuffix + '-' + file.originalname.replace(/\s/g, '_'));
    }
});

// Filter to allow specific document types for CVs
const fileFilter = (req, file, cb) => {
    const allowedTypes = /pdf|doc|docx/;
    const mimetype = allowedTypes.test(file.mimetype);
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
        return cb(null, true);
    }
    cb('Error: File type not supported! Only PDF, DOC, and DOCX are allowed for CVs.');
};

const cvUpload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 1024 * 1024 * 5 } // Limit file size to 5MB
});

module.exports = cvUpload;