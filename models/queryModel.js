const mongoose = require('mongoose')

const querySchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    ques : {
        type: String,
        required: true
    },
    sug : {
        type: String,
        required: true
    }
})

const Query = mongoose.model('queries', querySchema)
module.exports = Query