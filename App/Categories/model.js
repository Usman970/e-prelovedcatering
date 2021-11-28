const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CategorySchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    name: {
        type: String,
        trim: true
    }
}, {
    timestamps: true
});

const autoPopulate = function (next) {
    this.populate('user');
    next();
}

CategorySchema
    .pre('find', autoPopulate)
    .pre('findOne', autoPopulate)

module.exports = mongoose.model("Category", CategorySchema)