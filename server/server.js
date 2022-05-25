require("dotenv").config();
const express  = require("express");
const mongoose = require("mongoose");
const cors     = require("cors");
//用来解决CORS错误“No 'Access-Control-Allow-Origin' header is present on the requested resource.”
const path     = require("path");
const app      = express();
const PORT     = process.env.PORT || 4747;
const DB_URI   = "mongodb://localhost:27017/"
const DB       = "keeperDB";

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Establish DB connection
mongoose.connect(DB_URI + DB);

const db = mongoose.connection;
// Event listeners
db.once('open', () => console.log("Connected to database"));

// Create Schema
const noteSchema = new mongoose.Schema({
    title:String,
    content:String
    //这里不要写_id，否则从react提交过来req时会报错，提醒先设置_id再保存
    //但react中写上_id没法更改value，会存一个_id:""的document，之后就存不了了
})
// Create Model
const Note = mongoose.model("Note", noteSchema);

// Route to Get all notes，加载主页时就要从这里map，这个不是send到browser，而是send到react里
app.get("/",(req,res)=>{
Note.find({},(err,docs)=>{
    if(!err) {
        res.json(docs);
    } else {
        res.status(400).json({"error": err});;
    }
})
})

// Route to Add a note 从react添加，向react回应。
app.post("/add",(req,res)=>{
    // console.log(req.body);
    //无_id
    const newNote = new Note (req.body);
    newNote.save((err,result)=>{
        if(!err){
            console.log("New Note Added Successfully");
        }else {
            console.log(err);
  }
    })
})
app.post("/delete", function(req,res){
    console.log(req.body);
    const noteTitle = req.body.title;
    const noteContent = req.body.content;
//没有用Key和id。
    Note.findByIdAndDelete(req.body, (err) => {
        if(err){
            console.log(err);
        } else{
            console.log("Note Deleted Successfully");
            //console.log(res.body)显示Undefined。
        }
    });
    Note.find({},(err,docs)=>{
        if(!err) {
            console.log("Note Deleted+find Successfully")
            res.json(docs);
        } else {
            res.status(400).json({"error": err});
        }
    })
});


app.listen(PORT,()=>{
    console.log("server is running");
  });