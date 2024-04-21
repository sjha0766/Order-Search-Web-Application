// Customer Schema
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const customerSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    address: {
        street: String,
        city: String,
        state: String,
        country: String,
        pincode: String  // Changed from "zip" to "pincode" to match frontend
    },
    phone: String,
    orders: [{
        type: Schema.Types.ObjectId,
        ref: 'Order'
    }]
});

module.exports = mongoose.model('Customer', customerSchema);
