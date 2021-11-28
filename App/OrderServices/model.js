const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const OrderServiceSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    seller: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    service: {
        type: Schema.Types.ObjectId,
        ref: 'Service'
    },
    package: {
        type: Schema.Types.ObjectId,
        ref: 'Package'
    },
    status: {
        type: String,
        default: 'Ordered'
    },
    date: {
        type: Date
    }
}, {
    timestamps: true
});

const autoPopulate = function (next) {
    this.populate('user', '-password');
    this.populate('seller', '-password');
    this.populate('service');
    this.populate('package');
    next();
}

OrderServiceSchema
    .pre('find', autoPopulate)
    .pre('findOne', autoPopulate)

module.exports = mongoose.model("OrderService", OrderServiceSchema)