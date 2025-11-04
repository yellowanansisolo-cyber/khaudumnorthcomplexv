const mongoose = require('mongoose');

const teamMemberSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Team member name is required.'],
        trim: true
    },
    title: {
        type: String,
        required: [true, 'Team member title is required.'],
        trim: true
    },
    photo: {
        type: String,
        default: '/images/default-avatar.png'
    },
    displayOrder: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

module.exports = mongoose.model('TeamMember', teamMemberSchema);