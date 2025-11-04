const mongoose = require('mongoose');

const youthInitiativeSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    slug: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['Upcoming', 'Ongoing', 'Completed'],
        default: 'Upcoming'
    },
    coverImage: {
        type: String,
        default: '/images/default-youth.jpg'
    }
}, { timestamps: true });

module.exports = mongoose.model('YouthInitiative', youthInitiativeSchema);