const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const PackageSchema = new Schema({
    title: {
        type: String,
        trim: true
    },
    price: {
        type: Number
    },
    services: [{
        type: String,
        trim: true
    }],
    type: {
        type: String,
        enum: ['Service', 'Event']
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("Package", PackageSchema)