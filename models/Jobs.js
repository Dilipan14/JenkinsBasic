const mongoose=require('mongoose');
const Schema=mongoose.Schema();

const JobSchema=new Schema({
  class :{
    type:String,
    required:true
  },
  name :{
    type:String,
    required:true
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

mongoose.model('jobs',JobSchema);