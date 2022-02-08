const bcrypt = require('bcrypt');
const moongose = require('mongoose');

const UserSchema = new moongose.Schema({
  name: { type: String, require: true },
  email: { type: String, require: true, unique: true },
  birthday: { type: String },
  phoneNumber: { type: String, require: true, unique: true },
  password: { type: String, require: true },
  document: { type: String, require: true, unique: true },
  wallet: { type: moongose.Schema.Types.ObjectId, required: true, ref: 'Wallet' }
});

UserSchema.pre('save', function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  bcrypt.hash(this.password, 9).then((hash) => {
    this.password = hash;
    next();
  }).catch(next);
});

UserSchema.pre('findOneAndUpdate', function (next) {
  const data = this.getUpdate();
  if (!data.password) {
    return next();
  }
  bcrypt.hash(data.password, 9).then((hash) => {
    data.password = hash;
    this.update({}, data).exec();
    next();
  }).catch(next);
});

UserSchema.methods = {
  authenticate(password) {
    return bcrypt.compare(password, this.password).then((valid) => valid ? this : false);
  }
};

module.exports = moongose.model('User', UserSchema);