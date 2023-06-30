const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  id: {
    type: String
  },
  email: {
    type: String
  }
});

module.exports = mongoose.model('id', UserSchema);
