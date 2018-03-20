const express=require('express');
const mongoose =require('mongoose');
const jobsRoute=require('./route/jobroutes');

const app=express();

const port=5000

//Connection to Db
mongoose.connect('mongodb://localhost:27017/jenkins-dev')
.then(()=>{console.log("Connected to Mongo DB")})
.catch(error => console.log(error));

//Job Routes
app.use('/jobs',jobsRoute);


//Start Node Appln
app.listen(port, ()=>{
  console.log(`Server started at port ${port}`);
})
