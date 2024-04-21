// Order Schema
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    orderNumber: {
        type: String,
        required: true
    },
    customer: {
        type: Schema.Types.ObjectId,
        ref: 'Customer',
        required: true
    },
    products: [{
        name: String,
        price: Number,
        quantity: Number,
        model:String,
        img: String // Add img section for product image
    }],
    orderDate: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['Pending', 'payment-awaiting', 'Shipped', 'Delivered'],
        default: 'payment-awaiting'
    },
    totalPrice: {
        type: Number,
        required: true
    },
    discount:{
        type: Number,
        default: 0
    },
    paymentStatus:{
      type:String,
      default: 'Cash'  
    }
});

module.exports = mongoose.model('Order', orderSchema);
