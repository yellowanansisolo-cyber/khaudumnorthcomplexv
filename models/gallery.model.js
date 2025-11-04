const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        default: 'Khaudum North Complex'
    },
    filePath: {
        type: String,
        required: true
    },
    fileType: {
        type: String,
        enum: ['image', 'video'],
        default: 'image'
    }
}, { timestamps: true });

module.exports = mongoose.model('Gallery', gallerySchema);