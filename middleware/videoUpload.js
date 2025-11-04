const multer = require('multer');
const path = require('path');

// Configure storage for videos
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Videos will be saved in a separate 'videos' folder
        cb(null, 'public/uploads/videos'); 
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// Filter to allow specific video types
const fileFilter = (req, file, cb) => {
    // A simple check for video MIME types
    if (file.mimetype.startsWith('video')) {
        cb(null, true);
    } else {
        cb(new Error('Not a video! Please upload only video files.'), false);
    }
};

const videoUpload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 1024 * 1024 * 50 } // Limit file size to 50MB (adjust as needed)
});

module.exports = videoUpload;