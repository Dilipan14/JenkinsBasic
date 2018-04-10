const express=require('express');
const mongoose=require('mongoose');
const request=require('request');
const DeltaRouter=express.Router();
const schedule = require('node-schedule');
require('../models/Jobs');
const Jobs=mongoose.model('jobs');
const username='Dilipan';
const password='Kalaraj14';
const jenkinsUrl='http://localhost:8080/api/json?pretty=true';
const options = {
  uri : jenkinsUrl,
  auth: {
    user: username,
    password: password
  },
  method : 'GET',
  json:true
};

schedule.scheduleJob('27 * * * *',()=>{
  request(options,(error,response,body)=>{
    if(!error && response.statusCode == 200){
      body.jobs.forEach((jenkinsJob)=>{
        Jobs.findOne({name:jenkinsJob.name})
        .then((curjob)=>{
          if(curjob !==null){
            if(curjob.jobType === 'WorkflowJob' && jenkinsJob.color !=='notbuilt'){
              console.log(jenkinsJob.url);
              const stageOptions = {
                uri : curjob.url,
                auth: {
                  user: username,
                  password: password
                },
                method : 'GET',
                json:true
              }
              request(stageOptions,(error,response,body)=>{
                if(!error && response.statusCode == 200){
                if(body[0].stages.length > curjob.stages.length ){
                  for(var i=curjob.stages.length;i<body[0].stages.length;i++){
                    console.log(body[0].stages[i-1]);
                    Jobs.update({name:curjob.name},{
                      color:body[0].status === 'SUCCESS' ? 'blue' : 'red',
                      $push :{
                        "stages":{
                          "stageName":body[0].stages[i].name,
                          "stageModified":true
                        }
                      }
                    })
                    .catch(err=>console.log(err));
                  }
                  Jobs.update({name:curjob.name},{jobModified:true})
                  .catch(err=>console.log(err));
                }
                }
              })
            }
          }
        })
        .catch(err=>console.log(err));
      })
    }
  })
})
module.exports=DeltaRouter;
