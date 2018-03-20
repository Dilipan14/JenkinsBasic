const express=require('express');
const JobsRouter=express.Router();
const mongoose=require('mongoose');
const request=require('request');
require('../models/Jobs');
const Jobs=mongoose.model('jobs');
const jenkinsUrl='http://ci.ac3-servers.eu/api/json?tree=jobs[name,buildable,url,color]&pretty';

const options = {
        uri : jenkinsUrl,
        method : 'GET',
        json:true
        }

JobsRouter
//To get all jobs from the jenkins
 .get('/',(req,res)=>{
    request(options,(error,response,body)=>{
      if(!error && response.statusCode == 200){
        res.send(body);
        /*Jobs.collection.insert(JSON.parse(body))
                        .then((docs)=>{
                          res.send(docs)
                        })
                        .catch(err=>console.log(err))*/
      }
    })
  })
   /*.get('/',(req,res)=>{
     Jobs.find({})
          .then((jobs)=>{
            res.send(JSON.stringify(jobs))
          })
          .catch(err=>console.log(err));
   })*/

  module.exports=JobsRouter;
