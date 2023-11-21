const mongoose = require('mongoose');

const PollingModelSchema = new mongoose.Schema({
  poll: {
    obj_id : {
        type : String,
        require : true 
    },
    title: {
      type: String,
      required: true,
    },
    noofoptions : {
      type : Number
    },
    options: [{
      optiontext : {
        type : String , 
        required : true,
      },
      opted :{
        type : Number,
        default : 0,
      },
    }],
  },
});

const PollingModel = mongoose.model('Polls', PollingModelSchema);

module.exports = PollingModel;
