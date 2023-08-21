const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  accountholder: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
});

const Payment = mongoose.model("payment", paymentSchema);
module.exports = Payment;
