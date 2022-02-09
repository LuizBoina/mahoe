const PurchaseHistory = require('../models/PurchaseHistory');
const Wallet = require('../models/Wallet');

exports.createUserWallet = async () => {
  try {
    const result = await Wallet.create({ moneyAmount: 200 });
    return result.id;
  } catch (error) {
    console.log(error)
  }
}

const createPurchaseHistory = async (purchaseHistory) => {
  try {
    return await PurchaseHistory.create(purchaseHistory);
  } catch (error) {
    console.log(error)
  }
}

exports.buyCrypto = async (req, res) => {
  try {
    const { id } = req.params;
    const { code: cryptoCode, amount, price: purchasePrice } = req.body;
    const coinQtd = amount / purchasePrice;
    const ph = {
      purchasePrice,
      cryptoCode,
      amount: coinQtd,
      isBuy: true,
    };
    const wallet = await Wallet.findById(id, '-__v')
      .then(async doc => {
        const idx = doc.ownedCryptos.findIndex((crypto) => crypto.cryptoCode === cryptoCode);
        const _ph = await createPurchaseHistory(ph);
        doc.purchaseHistory.push(_ph);
        // new Crypto
        if (idx === -1) {
          doc.ownedCryptos.push({
            cryptoCode,
            amount: coinQtd,
            purchasePrice
          });
          doc.moneyAmount -= Number(amount);
          const updated = await doc.save();
          return updated
        }
        // already have crypto
        doc.ownedCryptos[idx]["purchasePrice"] = purchasePrice;
        doc.ownedCryptos[idx]["purchaseTime"] = Date.now();
        doc.ownedCryptos[idx]["amount"] += coinQtd;
        doc.moneyAmount -= Number(amount);
        const updated = await doc.save();
        return updated
      });
    return res
      .code(200)
      .send(wallet);
  } catch (error) {
    console.log(error);
    return res
      .code(500)
      .send(error);
  }
}

exports.sellCrypto = async (req, res) => {
  try {
    const { id } = req.params;
    const { code: cryptoCode, amount, price: purchasePrice } = req.body;
    const ph = {
      purchasePrice,
      cryptoCode,
      amount,
      isBuy: false,
    };
    const wallet = await Wallet.findById(id, '-__v')
      .then(async doc => {
        const idx = doc.ownedCryptos.findIndex((crypto) => crypto.cryptoCode === cryptoCode);
        const _ph = await createPurchaseHistory(ph);
        doc.purchaseHistory.push(_ph);
        doc.ownedCryptos[idx]["purchasePrice"] = purchasePrice;
        doc.ownedCryptos[idx]["purchaseTime"] = Date.now();
        doc.ownedCryptos[idx]["amount"] -= amount;
        doc.moneyAmount += amount * purchasePrice;
        const updated = await doc.save();
        return updated;
      });
    return res
      .code(200)
      .send(wallet);
  } catch (error) {
    console.log(error);
    return res
      .code(500)
      .send(error);
  }
}

exports.getWalletInfo = async (req, res) => {
  const { id } = req.params;
  try {
    const wallet = await Wallet.findById(id, '-__v').populate('purchaseHistory', '-__v');
    if (!wallet) {
      return res
        .code(404)
        .send("carteira não encontrada");
    }
    return res
      .code(200)
      .send(wallet)
  } catch (error) {
    return res
      .code(500)
      .send(error)
  }
}