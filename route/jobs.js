const express=require('express');
const JobsRouter=express.Router();
const request=require('request');
const jenkinsUrl='http://ci.ac3-servers.eu/api/json?tree=jobs[name,buildable,url,color]&pretty';

const options = {
        uri : jenkinsUrl,
        method : 'GET'
    }

JobsRouter
//To get all jobs from the jenkins
  .get('/',(req,res)=>{
    request(options,(error,response,body)=>{
      if(!error && response.statusCode == 200){
        res.setHeader('Content-Type', 'application/json');
        res.send(body);
      }
    })
  })
  
  module.exports=JobsRouter;