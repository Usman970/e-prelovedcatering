const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const RentProductSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    seller: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    product: {
        type: Schema.Types.ObjectId,
        ref: 'Product'
    },
    status: {
        type: String,
        default: 'Rented'
    }
}, {
    timestamps: true
});

const autoPopulate = function (next) {
    this.populate('user', '-password');
    this.populate('seller', '-password');
    this.populate('product');
    next();
}

RentProductSchema
    .pre('find', autoPopulate)
    .pre('findOne', autoPopulate)

module.exports = mongoose.model("RentProduct", RentProductSchema)