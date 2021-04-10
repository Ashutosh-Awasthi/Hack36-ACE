var express = require("express");
var app = express();
var request = require("request");
var bodyParser = require("body-parser");
var data;

function titleCase(words) {
    var separateWord = words.toLowerCase().split(' ');
    for (var i = 0; i < separateWord.length; i++) {
       separateWord[i] = separateWord[i].charAt(0).toUpperCase() +
       separateWord[i].substring(1);
    }
    return separateWord.join(' ');
 }

request("https://api.covid19india.org/state_district_wise.json",(err,res,body)=>{
    if(res.statusCode==200&&!err){
        data = JSON.parse(body);
    }else{
        console.log(err);
    }
});

app.set("view engine","ejs")
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));

//.....routes
app.get("/",(req,res)=>{
    res.redirect("/form")
});

app.get("/form",(req,res)=>{
    
    res.render("form",{body: data});
});

app.post("/show",(req,res)=>{
    req.body.District = titleCase(req.body.District);
    req.body.State = titleCase(req.body.State);
    if(data){
        if(!data[req.body.State]["districtData"][req.body.District]){
            res.redirect("/");
        }
        res.render("show",{data: data, body: req.body});  
    }
    else{
        res.redirect("/")
    }
})
// app.get("form",(req,res)=>{
    
// })

app.listen(3000,()=>{ console.log("app is running" )});