
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    firstname: {
      type: String,
      required: true
    },
    lastname: {
      type: String,
      required: true
    },
    email: {  
      type: String,
      required: true
  },
  city: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  isAdmin: {
    type: Boolean,
    required: false
  },
  cart: {
    type: Array,
    required: false
  }
},

  { timestamps: true }
);
  
module.exports = mongoose.model('User', userSchema);