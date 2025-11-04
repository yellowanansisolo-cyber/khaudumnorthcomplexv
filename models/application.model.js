const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
    job: {
        type: mongoose.Schema.ObjectId,
        ref: 'Job',
        required: true
    },
    applicantName: {
        type: String,
        required: true
    },
    applicantEmail: {
        type: String,
        required: true
    },
    coverLetter: {
        type: String
    },
    cvPath: {
        type: String,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Application', applicationSchema);