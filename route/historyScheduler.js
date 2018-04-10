const express=require('express');
const mongoose=require('mongoose');
const request=require('request');
const HistoryRouter=express.Router();
const schedule = require('node-schedule');
require('../models/Jobs');
const Jobs=mongoose.model('jobs');
require('../models/History');
const History=mongoose.model('jobHistory');
const username='Dilipan';
const password='Kalaraj14';
const jenkinsUrl='http://localhost:8080/api/json?pretty=true';
const subjobsUrl='http://localhost:8080/job/exa2/wfapi/runs/';


schedule.scheduleJob('45 * * * *',()=>{
  mongoose.connection.db.listCollections({name: 'jobhistories'})
  .next((err, collinfo)=> {
    if (collinfo) {
      Jobs.find({})
      .then((jobs)=>{
        jobs.forEach((job)=>{
          const curJob=null;
          History.find({name:job.name})
          .sort({'job.id':-1})
          .limit(1)
          .then((latestJob) => {
            if(job.url.includes('wfapi')){
              if(job.color !== 'notbuilt'){
                const workStyleJobOptions={
                  uri : job.url,
                  auth: {
                    user: username,
                    password: password
                  },
                  method : 'GET',
                  json:true
                }
                request(workStyleJobOptions,(error,response,body)=>{
                  if(!error && response.statusCode == 200){
                    if(latestJob.length >0 && body[0].id > latestJob[0].job.id){
                      for(var i=0;i < body[0].id - latestJob[0].job.id;i++){
                        const delta={
                          job:body[i],
                          name:job.name
                        }
                        new History(delta).save()
                        .catch(err=>console.log(err));
                      }
                    }
                  }
                })
              }
            }else {
                const freeStyleJobOptions={
                uri : job.url,
                auth: {
                  user: username,
                  password: password
                },
                method : 'GET',
                json:true
              }
              request(freeStyleJobOptions,(error,response,body)=>{
                if(!error && response.statusCode == 200){
                  if(body.color!== 'notbuilt' && body.builds[0].number > latestJob[0].job.id){
                    for(var j=0;j<body.builds[0].number - latestJob[0].job.id;j++){
                      const deltaBuilds={
                        uri :body.builds[j].url+'api/json',
                        auth: {
                          user: username,
                          password: password
                        },
                        method : 'GET',
                        json:true
                      }
                      request(deltaBuilds,(error,response,body)=>{
                        if(!error && response.statusCode == 200){
                          const delta={
                            job:body,
                            name:job.name
                          }
                          new History(delta).save()
                          .catch(err=>console.log(err));
                        }
                      })
                    }
                  }
                }
              })

            }
          })
          .catch(err=>console.log(err));

        })
      })
    }else{
      Jobs.find({})
      .then((jobs)=>{
        jobs.forEach((job)=>{
          if(job.url.includes('wfapi')){
            const workStyleJobOptions={
              uri : job.url,
              auth: {
                user: username,
                password: password
              },
              method : 'GET',
              json:true
            }
            request(workStyleJobOptions,(error,response,body)=>{
              if(!error && response.statusCode == 200){
                body.forEach((run)=>{
                  const newHistory={
                    job:run,
                    name:job.name
                  }
                  new History(newHistory).save()
                  .catch(err=>console.log(err));
                })
              }
            })
          }else{
            const freeStyleJobOptions={
              uri : job.url,
              auth: {
                user: username,
                password: password
              },
              method : 'GET',
              json:true
            }
            request(freeStyleJobOptions,(error,response,body)=>{
              if(!error && response.statusCode == 200){
                console.log(body.displayName);
                body.builds.forEach((build)=>{
                  const freeStyleEachBuildOptions={
                    uri : build.url + 'api/json',
                    auth: {
                      user: username,
                      password: password
                    },
                    method : 'GET',
                    json:true
                  }
                  request(freeStyleEachBuildOptions,(error,response,body)=>{
                    if(!error && response.statusCode == 200){
                      const newHistory={
                        job:body,
                        name:job.name
                      }
                      new History(newHistory).save()
                      .catch(err=>console.log(err));
                    }
                  })
                })
              }
            })

          }

        })
      })
    }

  });
})


module.exports=HistoryRouter;
