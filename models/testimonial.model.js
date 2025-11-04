const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema({
    quote: { type: String, required: true },
    authorName: { type: String, required: true },
    authorTitle: { type: String, required: true }, // e.g., "Community Member", "Partner CEO"
    isActive: { type: Boolean, default: true }
});

module.exports = mongoose.model('Testimonial', testimonialSchema);