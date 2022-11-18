//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const md5 = require("md5");

const app = express();

// console.log(md5("123456"));

app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/userDB");

const userSchema = new mongoose.Schema ({
    username: String,
    password: String 
});

const User = mongoose.model("User",userSchema);

app.get("/",function(req,res){
    res.render("home");
});

app.get("/register",function(req,res){
    res.render("register");
});

app.get("/login",function(req,res){
    res.render("login");
});

app.post("/register",function(req,res){
    const newUser = new User ({
        username: req.body.username,
        password: md5(req.body.password)
    });
    newUser.save(function(err){
        if (err) {
            console.log(err);
        } else {
            res.render("secrets");
        }
    });
});

app.post("/login",function(req,res){
    const username = req.body.username;
    const password = md5(req.body.password);
    // console.log(typeof password);
    // console.log(password);

    User.findOne({username:username},function(err,foundUser){
        if (err) {
            console.log(err);
        } else {
            if (foundUser) {
                if (foundUser.password === password) {
                    res.render("secrets");
                } else {
                    // console.log(foundUser.email);  làm gì có email nó tên là username mà
                    // console.log(typeof foundUser.password);
                    // console.log(foundUser.password);
                    res.send("NO equal");
                }
            } else {
                res.send("No found");
            }
        }
    });
});

app.listen(3000,function(){
    console.log("Server is running on port 3000");
});