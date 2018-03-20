const mongoose=require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const JobSchema=mongoose.Schema({
  class :{
    type:String,
    required:true
  },
  name :{
    type:String,
    required:true,
    unique:true
  },
  url:{
    type:String,
    required:true
  },
  buildable:{
    type:Boolean,
    required:true
  },
  color:{
    type:String,
    required:true
  }
});
JobSchema.plugin(uniqueValidator);
mongoose.model('jobs',JobSchema);
