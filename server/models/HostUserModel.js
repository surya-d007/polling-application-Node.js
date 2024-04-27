const mongoose = require('mongoose');

const HostuserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  polls: [{
    title: {
      type: String,
      required: true,
    },
    noofoptions : {
      type : Number
    },
    options: [{
      type: String,
    }],
  }],
});

const HostUserModel = mongoose.model('hostuser_poll', HostuserSchema);

module.exports = HostUserModel;
