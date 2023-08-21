const mongoose = require("mongoose");
const schema = mongoose.Schema;

const userSchema = new schema({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  confirmPassword: {
    type: String,
    required: true,
  },
  usertype: {
    type: String,
    required: true,
    index: true
  },
  profilePic: {
    type: String,
  },
  cart: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
  products : [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
  status: {
    type: String,
    default: "active",
  },
  pincode: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
