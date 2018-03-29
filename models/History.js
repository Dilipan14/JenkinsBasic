const mongoose=require('mongoose');

const HistorySchema=mongoose.Schema({
  job:{
    type:Schema.Types.Mixed,
    required:true
  }
})
mongoose.model('jobHistory',HistorySchema);
