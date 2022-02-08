const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');


exports.login = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user)
    return res
      .code(400)
      .send('Usuário não cadastrado');
  const isEqual = await bcrypt.compare(req.body.password, user.password);
  if (!isEqual) {
    return res
      .code(400)
      .send('Senha incorreta');
  }
  const token = jwt.sign({
    userId: user.id,
    walletId: user.wallet
  },
    process.env.JWT_TOKEN,
    { expiresIn: '12h' });
  return res
    .code(200)
    .send({
      userId: user.id,
      username: user.name,
      token: token,
      walletId: user.wallet
    });
}