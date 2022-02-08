const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { createValidate, updateValidate } = require('./validators/userValidator');
const bcrypt = require('bcrypt');
const walletController = require('./walletController');

const validateExistence = async user => {
  try {
    const problems = await createValidate(user);
    if (problems) {
      return problems;
    }
  } catch (error) {
    console.log(error)
    return error;
  }
}

exports.createUserHandle = async (user) => {
  try {
    const problems = await validateExistence(user);
    if (problems) {
      return problems;
    }
    const walletId = await walletController.createUserWallet();
    user.wallet = walletId;
    const result = await User.create(user);
    return { ...result._doc, password: null, _id: result.id };
  } catch (error) {
    console.log(error)
    return error;
  }
}

exports.createUser = async (req, res) => {
  try {
    const result = await this.createUserHandle(req.body);
    if (result._id) {
      const token = jwt.sign(
        {
          userId: result._id,
          walletId: result.wallet,
        },
        process.env.JWT_TOKEN);
      return res
        .code(200)
        .send({
          userId: result._id,
          walletId: result.wallet,
          username: result.name,
          token: token
        });
    }
    else if (typeof result === 'string') {
      return res
        .code(400)
        .send(result)
    }
    else {
      return res
        .code(500)
        .send(result)
    }
  } catch (error) {
    return res
      .code(500)
      .send(error);
  }
}

exports.validateUser = async (req, res) => {
  try {
    const user = req.body;
    const problems = await validateExistence(user);
    if (problems) {
      return res
        .code(400)
        .send(problems);
    }
    return res
      .code(200)
      .send();
  } catch (error) {
    console.log(error)
    return res
      .code(500)
      .send(error);
  }
}

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res
        .code(404)
        .send('usuario nao encontrado');
    }
    if (res) {
      return res
        .code(204)
        .send();
    }
  } catch (error) {
    if (res) {
      return res
        .code(500)
        .send(error);
    }
  }
}

//called alone by storeController
exports.handleUpdateUser = async (id, payload) => {
  try {
    if (payload.oldPassword && payload.newPassword) {
      const oldUser = await User.findById(id);
      const isEqual = await bcrypt.compare(payload.oldPassword, oldUser.password);
      if (!isEqual) {
        return {
          code: 400,
          message: 'Senha incorreta'
        }
      }
      delete payload.oldPassword;
      payload.password = payload.newPassword.slice();
      delete payload.newPassword;
    }
    const user = await User.findOneAndUpdate({ _id: id }, payload, { new: true }).lean();
    const { password, __v, ..._user } = user;
    return {
      code: 200,
      message: _user
    }
  } catch (error) {
    console.log(error);
    return {
      code: 500,
      message: 'Erro ao atualizar usuario'
    }
  }
}

//called on route (always mobile)
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const problems = await updateValidate({
      ...req.body,
      _id: id,
    });
    if (problems) {
      return res
        .code(400)
        .send(problems);
    }
    const response = await this.handleUpdateUser(id, req.body);
    if (response.code !== 200) {
      return res
        .code(response.code)
        .send(response.message);
    }
    return res
      .code(response.code)
      .send(response.message);
  } catch (error) {
    return res
      .code(500)
      .send(error);
  }
}

exports.getUserFromId = async id => {
  try {
    const user = await User.findById(id, '-password -__v');
    return user;
  } catch (error) {
    console.log(error)
    return;
  }
}

exports.getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await this.getUserFromId(id);
    if (!user) {
      return res
        .code(404)
        .send('usuario nao encontrado')
    }
    return res
      .code(200)
      .send(user)
  } catch (error) {
    return res
      .code(500)
      .send(error)
  }
}
