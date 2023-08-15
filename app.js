const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");


const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

mongoose.connect("mongodb://0.0.0.0:27017/wikiDB", {useNewUrlParser: true})

const articleSchema = {
    title: String,
    content: String
}

const Article = mongoose.model("Article", articleSchema);

app.route("/articles").get(function(req,res){
    Article.find().then(result => {
       res.send(result);
    }).catch(err => {
       res.send(err);
    })
   }).post(function(req,res){

    const newArticle = new Article({
        title: req.body.title,
        content: req.body.content
    });
    newArticle.save().then(result=>{
         res.send("successfull");
    }).catch(err=>{
        res.send("error");
    });

}).delete(function(req,res){

    Article.deleteMany().then(result=>{
     res.send("deleted");
    }).catch(err=>{
     res.send("error");
    });    
 });

 /////////Route for specific articles//////

 app.route("/articles/:articleTitle")
 .get(function(req,res){
    Article.findOne({
        title: req.params.articleTitle
    }).then(result=>{
        res.send(result);
    }).catch(err=>{
        res.send("Article not found");
    });
 }).put(function(req,res){
    Article.updateOne({
        title: req.params.articleTitle
    },{
        title: req.body.title, content: req.body.content
    }
    ).then(result=>{
        res.send(result);
    }).catch(err=>{
        res.send(err);
    })
 }).patch(function(req,res){
    Article.updateOne({
        title: req.params.articleTitle
    },{
        $set: req.body
    }).then(result=>{
        res.send(result);
    }).catch(err=>{
        res.send(err);
    });
 }).delete(function(req,res){
    Article.deleteOne({
        title: req.params.articleTitle
    }).then(result =>{
        res.send(result);
    }).catch(err=>{
        res.send(err);
    });
 });



app.listen(3000,function(){
    console.log("server has been started");
})