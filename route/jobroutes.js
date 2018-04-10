const express=require('express');
const JobsRouter=express.Router();
const mongoose=require('mongoose');
const request=require('request');
const schedule = require('node-schedule');
require('../models/Jobs');

const Jobs=mongoose.model('jobs');

const username='Dilipan';
const password='Kalaraj14';
const jenkinsUrl='http://localhost:8080/api/json?pretty=true';
const subjobsUrl='http://localhost:8080/job/exa2/wfapi/runs/';

const options = {
  uri : jenkinsUrl,
  auth: {
    user: username,
    password: password
  },
  method : 'GET',
  json:true
};
const option1 = {
  uri : subjobsUrl,
  auth: {
    user: username,
    password: password
  },
  method : 'GET',
  json:true
}

schedule.scheduleJob('08 * * * *',()=>{
  mongoose.connection.db.listCollections({name: 'jobs'})
  .next((err, collinfo)=> {
    if(collinfo){
      request(options,(error,response,body)=>{
        if(!error && response.statusCode == 200){
          body.jobs.forEach((jenkinsJob)=>{
            Jobs.findOne({name:jenkinsJob.name})
            .then((curjob)=>{
              if(curjob===null){
                const newJob={
                  url :  jenkinsJob._class.includes('WorkflowJob') ? jenkinsJob.url+ 'wfapi/runs' : jenkinsJob.url+ 'api/json',
                  jobType:jenkinsJob._class.split(/[. ]+/).pop(),
                  name:jenkinsJob.name,
                  color:jenkinsJob.color,
                  stages:[],
                  jobModified:true
                };
                if(jenkinsJob._class.includes('WorkflowJob') && jenkinsJob.color !== 'notbuilt' ){
                  //console.log('values '+newJob);
                  const stageOptions={
                    uri : jenkinsJob.url+ 'wfapi/runs',
                    auth: {
                      user: username,
                      password: password
                    },
                    method : 'GET',
                    json:true
                  }
                  request(stageOptions,(error,response,body)=>{
                    if(!error && response.statusCode == 200){
                      const tempArr=[];
                      body[0].stages.forEach((stage)=>{
                        const stageModified={
                          stageName:stage.name,
                          stageModified:true
                        }
                        newJob.stages.push(stageModified);
                      })
                      new Jobs(newJob).save()
                      .then((job)=>{
                        //console.log(job);
                      })
                      .catch(err=>console.log(err));
                    }
                  });
                }else{
                  new Jobs(newJob).save()
                  .then((job)=>{
                    //console.log(job);
                  })
                  .catch(err=>console.log(err));
                }
              }
            })
          });
        }
      })

    }else{
      request(options,(error,response,body)=>{
        if(!error && response.statusCode == 200){
          body.jobs.forEach((jenkinsJob)=>{
            const newJob={
              url :  jenkinsJob._class.includes('WorkflowJob') ? jenkinsJob.url+ 'wfapi/runs' : jenkinsJob.url+ 'api/json',
              jobType:jenkinsJob._class.split(/[. ]+/).pop(),
              name:jenkinsJob.name,
              color:jenkinsJob.color,
              stages:[],
              jobModified:false
            };
            if(jenkinsJob._class.includes('WorkflowJob') && jenkinsJob.color !== 'notbuilt' ){
              //console.log('values '+newJob);
              const stageOptions={
                uri : jenkinsJob.url+ 'wfapi/runs',
                auth: {
                  user: username,
                  password: password
                },
                method : 'GET',
                json:true
              }
              request(stageOptions,(error,response,body)=>{
                if(!error && response.statusCode == 200){
                  const tempArr=[];
                  body[0].stages.forEach((stage)=>{
                    const stageModified={
                      stageName:stage.name,
                      stageModified:false
                    }
                    newJob.stages.push(stageModified);
                  })
                  new Jobs(newJob).save()
                  .then((job)=>{
                    //console.log(job);
                  })
                  .catch(err=>console.log(err));
                }
              });
            }else{
              new Jobs(newJob).save()
              .then((job)=>{
                //console.log(job);
              })
              .catch(err=>console.log(err));
            }
          })
        }
      })
    }
  })
});



JobsRouter
//To get all jobs from the jenkins
.get('/',(req,res)=>{
  request(options,(error,response,body)=>{
    if(!error && response.statusCode == 200){
      res.send(body.jobs);
      /*  Jobs.collection.insert(body.jobs)
      .then((docs)=>{
      res.send(docs)
      })
      .catch(err=>console.log(err)) */
    }
  })
})
.get('/subjobs',(req,res)=>{
  request(option1,(error,response,body)=>{
    const arr=[];
    if(!error && response.statusCode == 200){
      body[0].stages.forEach((stage)=>{
        arr.push((stage.name))
      })
      res.send(JSON.stringify(arr));

      /*  Jobs.collection.insert(body.jobs)
      .then((docs)=>{
      res.send(docs)
      })
      .catch(err=>console.log(err)) */
    }
  })
})
module.exports=JobsRouter;
