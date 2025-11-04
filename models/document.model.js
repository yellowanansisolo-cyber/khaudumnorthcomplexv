const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        enum: ['Report', 'Brochure', 'Policy', 'Other'],
        default: 'Other'
    },
    filePath: {
        type: String,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Document', documentSchema);