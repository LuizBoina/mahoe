const mongoose = require('mongoose');

const WalletSchema = new mongoose.Schema({
  moneyAmount: { type: Number, require: true, default: 200, min: 0 },
  purchaseHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'PurchaseHistory' }],
  ownedCryptos: [{
    cryptoCode: { type: String, require: true, maxLength: 5, index: true },
    amount: { type: Number, require: true, min: 0 },
    purchasePrice: { type: Number, require: true, min: 0 },
    purchaseTime: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

module.exports = mongoose.model('Wallet', WalletSchema);