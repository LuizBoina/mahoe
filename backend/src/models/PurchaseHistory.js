const mongoose = require('mongoose');

const PurchaseHistorySchema = new mongoose.Schema({
  purchasePrice: { type: Number, min: 0, require: true },
  amount: { type: Number, min: 0, require: true },
  isBuy: { type: Boolean, require: true },
  cryptoCode: { type: String, require: true, maxLength: 5, index: true },
}, { timestamps: true });

module.exports = mongoose.model('PurchaseHistory', PurchaseHistorySchema);