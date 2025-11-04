const mongoose = require('mongoose');

const naturalResourceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    coverImage: {
        type: String,
        default: '/images/default-resource.jpg'
    },
    // For policies, guidelines, etc.
    guidelines: {
        type: String
    }
}, { timestamps: true });

module.exports = mongoose.model('NaturalResource', naturalResourceSchema);