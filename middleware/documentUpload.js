const multer = require('multer');
const path = require('path');

// Configure storage for documents
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/documents'); // Save in a separate 'documents' folder
    },
    filename: function (req, file, cb) {
        // Keep the original filename for user-friendliness
        const uniqueSuffix = Date.now();
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});

// Filter to allow specific document types
const fileFilter = (req, file, cb) => {
    const allowedTypes = /pdf|doc|docx|txt/;
    const mimetype = allowedTypes.test(file.mimetype);
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
        return cb(null, true);
    }
    cb('Error: File type not supported! Only PDF, DOC, DOCX, and TXT are allowed.');
};

const documentUpload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 1024 * 1024 * 10 } // Limit file size to 10MB
});

module.exports = documentUpload;