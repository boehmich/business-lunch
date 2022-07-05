const mongoose = require('mongoose');

const invoiceSchema = mongoose.Schema({
    restaurant: {type: String, required: true},
    date: {type: String, required: true},
    amount: {type: Number, required: true},
    imagePath: {type: String, required: true}
});

module.exports = mongoose.model('Invoice', invoiceSchema);