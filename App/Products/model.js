const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    type: {
        type: String,
        trim: true
    },
    price: {
        type: Number
    },
    coverImage: {
        type: String,
        trim: true
    },
    images: [{
        type: String,
        trim: true
    }],
    status: {
        type: String,
        trim: true,
        default: 'Available'
    },
    measurements: [{
        type: String,
        trim: true
    }],
    description: {
        type: String,
        trim: true
    },
    stock: {
        type: Number
    },
    slots: [{
        start: {
            type: Date
        },
        end: {
            type: Date
        }
    }],
    services: [{
        type: String,
        trim: true
    }],
    availability: [{
        start: {
            type: Date
        },
        end: {
            type: Date
        },
        status: {
            type: String,
            trim: true,
            default: 'Available'
        }
    }],
    address: {
        type: String,
        trim: true
    },
    placeArea: {
        capacity: {
            type: Number
        },
        area: {
            type: String,
            trim: true
        }
    }
}, {
    timestamps: true
});

const autoPopulate = function (next) {
    this.populate('user');
    next();
}

ProductSchema
    .pre('find', autoPopulate)
    .pre('findOne', autoPopulate)

module.exports = mongoose.model("Product", ProductSchema)