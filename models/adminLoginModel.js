const mongoose = require('mongoose');

const adminloginSchema = new mongoose.Schema({
    password: {
        type: String,
        required: true
    },
})

const Admin = mongoose.model('Admin',adminloginSchema)
module.exports = Admin