const mongoose = require('mongoose');

const prescriptionSchema = new mongoose.Schema({
   user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
   },
   product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
   },
   prescription: {
    type: String,
    required: true
   },
   status: {
      type: Boolean,
      default: false
   }
})

const Prescription = mongoose.model('Prescription',prescriptionSchema)
module.exports = Prescription