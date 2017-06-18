var mongoose = require('mongoose');

var PaymentSchema = mongoose.Schema({
    payment_id: String,
    quantity: Number,
    status: String,
    link_slug: String,
    link_title: String,
    name: String,
    phone: String,
    email: String,
    currency: String,
    unit_price: String,
    amount: String,
    fees: String,
    created_at: { type : Date, default : Date.now },
    subscription_end_date: Date
});
module.exports = mongoose.model('Payment', PaymentSchema);