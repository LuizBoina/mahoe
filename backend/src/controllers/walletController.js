const Wallet = require('../models/Wallet');

exports.createUserWallet = async () => {
  try {
    const result = await Wallet.create({ moneyAmount: 200 });
    return result.id;
  } catch (error) {
    console.log(error)
  }
}

exports.buyCrypto = async (req, res) => {
  try {
    const { id } = req.params;
    const { code: cryptoCode, amount, price: purchasePrice } = req.body;
    const wallet = await Wallet.findById(id, '-__v')
      .then(async doc => {
        const idx = doc.ownedCryptos.findIndex((crypto) => crypto.code === cryptoCode);
        console.log("crypto", idx)
        // new Crypto
        if (idx === -1) {
          doc.ownedCryptos.push({
            cryptoCode,
            amount,
            purchasePrice
          });
          const updated = await doc.save();
          console.log(doc, updated)
          return res
            .code(200)
            .send(updated)
        }
        // already have crypto
        doc.ownedCryptos[idx]["purchasePrice"] = purchasePrice;
        doc.ownedCryptos[idx]["purchaseTime"] = Date.now();
        doc.ownedCryptos[idx]["amount"] += amount
        const updated = await doc.save();
        console.log(doc, updated)
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

exports.sellCrypto = async () => {
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