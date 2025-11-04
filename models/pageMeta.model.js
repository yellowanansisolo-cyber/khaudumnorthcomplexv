const mongoose = require('mongoose');

const pageMetaSchema = new mongoose.Schema({
    // Unique identifier for the page, e.g., '/about', '/projects'
    pageIdentifier: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    // The title to display in the hero section
    title: {
        type: String,
        required: true,
        trim: true
    },
    // Path to the hero image
    heroImage: {
        type: String,
        required: true,
        default: '/images/default-hero.jpg'
    },
    // Optional: Add a meta description for SEO
    metaDescription: {
        type: String
    }
});

module.exports = mongoose.model('PageMeta', pageMetaSchema);