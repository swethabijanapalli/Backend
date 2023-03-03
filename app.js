const express = require('express')
const cors = require('cors')
const app = express()
const PORT = 4000

const mongoose = require('mongoose')
mongoose.set('strictQuery', false);

//require database model
const User = require('./models/users')
const Post = require('./models/posts')

//middlewares
app.use(express.json()) //json should be method
app.use(express.urlencoded({extended:false}))
app.use(cors()) //cross origin resource sharing - to share resource from different origin/files - connection btw frontend and backend

const dbURL = "mongodb://localhost:27017/foodie"
mongoose.connect(dbURL).then(()=>{
    console.log("connected to database");
})

app.post('/login',(req,res)=>{
    User.findOne({email:req.body.email},(err,userData)=>{
        if (userData) {
            if (req.body.password == userData.password) {
                res.send({message:'login successfull'})
            } else {
                res.send({message:'login failed'})
            }
        } else {
            res.send({message:'no account seems to be matching with your email'})
        }
    })
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

app.get('/posts',async(req,res)=>{
    try {
        let posts = await Post.find()
        res.send(posts)
    } catch (error) {
        console.log(err);
    }
})

app.get('/posts/:id',async (req,res)=>{
    const {id} = req.params
    try {
        const singlePost = await Post.findById(id)
        res.send(singlePost)
    } catch (error) {
        res.send(error)
    }
})

app.post('/add-posts',async(req,res)=>{
    let postData = new Post({
        author:req.body.author,
        title:req.body.title,
        summary:req.body.summary,
        image:req.body.image,
        location:req.body.location
    })
    try {
        await postData.save()
        res.send({message:"Post added successfully"})
    } catch (error) {
        res.send({message:"Failed to add post"})
    }
})

app.listen(PORT,()=>{
    console.log(`listening to port ${PORT}`);
})