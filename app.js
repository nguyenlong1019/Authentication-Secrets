//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const app = express();


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
    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
        // Store hash in your password DB.
        const newUser = new User ({
            username: req.body.username,
            password: hash
        });
        newUser.save(function(err){
            if (err) {
                console.log(err);
            } else {
                res.render("secrets");
            }
        });
    });
    
});

app.post("/login",function(req,res){
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({username:username},function(err,foundUser){
        if (err) {
            console.log(err);
        } else {
            if (foundUser) {
                bcrypt.compare(password, foundUser.password, function(err, result) {
                    // result == true
                    if(result === true)
                    {
                        res.render("secrets");
                    }
                });
            } else {
                res.send("No found");
            }
        }
    });
});

app.listen(3000,function(){
    console.log("Server is running on port 3000");
});