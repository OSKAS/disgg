const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const hashedPassword = await bcrypt.hash(this.password, 10);
  this.password = hashedPassword;
  next();
});

UserSchema.methods.generateAuthToken = function () {
  return jwt.sign({ _id: this._id, username: this.username }, 'your_jwt_secret');
};

module.exports = mongoose.model('User', UserSchema);
