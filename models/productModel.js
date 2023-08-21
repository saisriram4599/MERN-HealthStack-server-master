const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    productname: {
        type: String,
        required: true
    },
    img : {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true,
        index: true
    },
    category: {
        type: String,
        required: true
    },
    status: {
        type: String,
    },
})

const Product = mongoose.model('Product',productSchema)
module.exports = Product