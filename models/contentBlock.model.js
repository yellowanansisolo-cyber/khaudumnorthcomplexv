const mongoose = require('mongoose');

const contentBlockSchema = new mongoose.Schema({
    pageIdentifier: {
        type: String,
        required: true,
        default: 'home'
    },
    sectionIdentifier: {
        type: String,
        required: true,
        unique: true
    },
    content: {
        type: String,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('ContentBlock', contentBlockSchema);