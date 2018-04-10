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
  stages:[
    {
      stageName:{
        type:String,
        required:true
      },
      stageModified:{
        type:Boolean
      },
      StageModifiedTime:{
        type: Date,
        default: Date.now
      }
    }],
  color:{
    type:String,
    required:false
  },
  jobModified :{
    type:Boolean,
    required:false
  },
  jobModifiedTime:{
    type: Date,
    default: Date.now
  }
  });
  JobSchema.plugin(uniqueValidator);
  mongoose.model('jobs',JobSchema);
