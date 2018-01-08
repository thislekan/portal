const mongoose = require('mongoose');

const Data = mongoose.model('Data', {
    courses: {
        type: [{
            type: String,
            trim: true,
            required: 'Please fill in your courses'
        }]
    },
    gender: {
        type: String,
        trim: true
    },
    faculty: {
        type: String,
        trim: true,
        required: 'Please indicate your faculty'
    },
    department: {
        type: String,
        trim: true,
        required: 'Please indicate your department'
    },
    level: {
        type: String,
        trim: true,
        required: 'Please indicate your current level'
    },
    regNo: {
        type: String,
        required: 'Please enter your registration number',
        unique: 'That registration number already exists'
    },
    createdOn: {
        type: Number,
        default: null
    },
    _creator: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    _creatorName: {
        type: String,
        trim: true,
    },
    courseTable: {
        type: String,
        minlength: 1
    }
});

module.exports = { Data };