const mongoose=require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const JobSchema=mongoose.Schema({
  name :{
    type:String,
    required:true,
    unique:true
  },
  jobType:{
    type:String,
    required:true
  },
  url:{
    type:String,
    required:true
  },
  stages:[{
    type:String,
    required:false
  }],
  color:{
    type:String,
    required:false
  }
});
JobSchema.plugin(uniqueValidator);
mongoose.model('jobs',JobSchema);
