const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
    },
    comment: {
        type: String,
        required: true
    },
})

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;