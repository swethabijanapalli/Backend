const express = require('express')
const cors = require('cors')
const app = express()
const PORT = 4000

const mongoose = require('mongoose')
mongoose.set('strictQuery', false);

//require database model
const User = require('./models/users')

//middlewares
app.use(express.json()) //json should be method
app.use(express.urlencoded({extended:false}))
app.use(cors()) //cross origin resource sharing - to share resource from different origin/files - connection btw frontend and backend

const dbURL = "mongodb://localhost:27017/foodie"
mongoose.connect(dbURL).then(()=>{
    console.log("connected to database");
})

//route is same as given for signup Pg in frontend
app.post('/signup',async(req,res)=>{
    //finding the email existing or not
    User.findOne({email:req.body.email},(err,userData)=>{
        //if email exist sending response as already exist
        if (userData) {
            res.send({message:"User already exist"})
        } else {
            //adding data to model
            const data = new User({
                name:req.body.name,
                mobile:req.body.mobile,
                email:req.body.email,
                password:req.body.password
            })
            data.save(()=>{
                if(err){
                    res.send(err)
                } else {
                    res.send({message:"User registered successfully"})
                }
            })
        }
    })
})

app.listen(PORT,()=>{
    console.log(`listening to port ${PORT}`);
})