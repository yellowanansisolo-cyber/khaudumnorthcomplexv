const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
    amount: {
        type: Number,
        required: true
    },
    donorName: {
        type: String,
        default: 'Anonymous'
    },
    donorEmail: {
        type: String,
        trim: true
    },
    status: {
        type: String,
        enum: ['Succeeded', 'Pending', 'Failed'],
        default: 'Succeeded' // Simulating success for this implementation
    },
    paymentGateway: {
        type: String,
        default: 'Simulated Gateway'
    }
}, { timestamps: true });

module.exports = mongoose.model('Donation', donationSchema);