const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const EventSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    category: {
        type: String,
        trim: true
    },
    subCategory: {
        type: String,
        trim: true
    },
    coverImage: {
        type: String,
        trim: true
    },
    images: [{
        type: String,
        trim: true
    }],
    services: [{
        type: Schema.Types.ObjectId,
        ref: 'Service'
    }],
    packages: [{
        type: Schema.Types.ObjectId,
        ref: 'Package'
    }],
    description: {
        type: String,
        trim: true
    },
    facilities: [{
        type: String,
        trim: true
    }]
}, {
    timestamps: true
});

const autoPopulate = function (next) {
    this.populate('user');
    this.populate('services');
    this.populate('packages');
    next();
}

EventSchema
    .pre('find', autoPopulate)
    .pre('findOne', autoPopulate)

module.exports = mongoose.model("Event", EventSchema)