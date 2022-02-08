const Joi = require("joi");
const User = require('../../models/User');

const createUserValidator = () => ({
  name: Joi.string().required(),
  email: Joi.string().required().regex(/^[a-z0-9.]+@[a-z0-9]+.[a-z]+.([a-z]+)?$/i),
  phoneNumber: Joi.string().required().replace(/\D/g, ''),
  birthday: Joi.string().required(),
  password: Joi.string().required(),
  document: Joi.string().required().replace(/\D/g, ''),
});

const updateUserValidator = () => ({
  _id: Joi.string().optional(),
  name: Joi.string().optional(),
  email: Joi.string().optional().regex(/^[a-z0-9.]+@[a-z0-9]+.[a-z]+.([a-z]+)?$/i),
  phoneNumber: Joi.string().optional().replace(/\D/g, ''),
  birthday: Joi.string().optional(),
  oldPassword: Joi.string().optional(),
  newPassword: Joi.string().optional(),
  document: Joi.string().optional().replace(/\D/g, ''),
});


module.exports = {
  userSchema: createUserValidator,
  updateUserSchema: updateUserValidator,
  createValidate: async (user) => {
    let schema = Joi.object({
      ...createUserValidator()
    });

    const { error } = schema.validate(user);

    if (error && error.details) {
      return error.details.map((d) => d.message).join(", ");
    }
    const existingUser = await User.findOne({
      $or: [
        { email: user.email },
        { phoneNumber: user.phoneNumber },
        { document: user.document }
      ],
    });
    if (existingUser) {
      if (existingUser.email === user.email)
        return 'Email já registrado';
      else if (existingUser.phoneNumber === user.phoneNumber)
        return 'Número de telefone já registrado';
      else
        return 'Documento já registrado';
    }
  },
  updateValidate: async (user) => {
    let schema = Joi.object({
      ...updateUserValidator()
    });

    const { error } = schema.validate(user);

    if (error && error.details) {
      return error.details.map((d) => d.message).join(", ");
    }
    const existingUser = await User.findOne({
      _id: { $ne: user._id },
      $or: [
        { email: user.email },
        { phoneNumber: user.phoneNumber },
        { document: user.document }
      ],
    });
    if (existingUser) {
      if (existingUser.email === user.email)
        return 'Email já registrado';
      else if (existingUser.phoneNumber === user.phoneNumber)
        return 'Número de telefone já registrado';
      else
        return 'Documento já registrado';
    }
  }
}
