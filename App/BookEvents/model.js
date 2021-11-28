const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const BookEventSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    seller: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    event: {
        type: Schema.Types.ObjectId,
        ref: 'Event'
    },
    package: {
        type: Schema.Types.ObjectId,
        ref: 'Package'
    },
    status: {
        type: String,
        default: 'Booked'
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
    this.populate('event');
    this.populate('package');
    next();
}

BookEventSchema
    .pre('find', autoPopulate)
    .pre('findOne', autoPopulate)

module.exports = mongoose.model("BookEvent", BookEventSchema)