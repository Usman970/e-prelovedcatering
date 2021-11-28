const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ServiceSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    name: {
        type: String,
        trim: true
    },
    type: {
        type: String,
        trim: true
    },
    coverImage: {
        type: String,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    images: [{
        type: String,
        trim: true
    }],
    // portfolio: [{
    //     name: {
    //         type: String,
    //         trim: true
    //     },
    //     cover: {
    //         type: String,
    //         trim: true
    //     },
    //     images: [{
    //         type: String,
    //         trim: true
    //     }]
    // }],
    packages: [{
        type: Schema.Types.ObjectId,
        ref: 'Package'
    }]
}, {
    timestamps: true
});

const autoPopulate = function (next) {
    this.populate('user', '-password');
    this.populate('packages')
    next();
}

ServiceSchema
    .pre('find', autoPopulate)
    .pre('findOne', autoPopulate)

module.exports = mongoose.model("Service", ServiceSchema);