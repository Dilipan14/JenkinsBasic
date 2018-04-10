const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const HistorySchema=mongoose.Schema({
  job:{
    type:Schema.Types.Mixed,
    required:true
  },
  name:{
    type:String,
    required:true
  }
})
mongoose.model('jobHistory',HistorySchema);
