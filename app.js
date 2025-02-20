var express  = require("express"),
methodOverride = require("method-override"),
expressSanitizer = require("express-sanitizer"),
app          = express(),
bodyParser    = require("body-parser"),
mongoose     = require("mongoose");

mongoose.connect("mongodb://localhost/food_for_thought",{ useNewUrlParser: true,useUnifiedTopology: true  });
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));

// Configurationg for the mongoose database
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body:  String,
    created: {type: Date, default: Date.now}
});

var Blog = mongoose.model("Blog",blogSchema);


//RESTFUL ROUTES
app.get("/",function(req,res){
  res.redirect("/blogs");
});

 app.get("/blogs",function(req,res){
   Blog.find({},function(err, blogs){
     if(err){
       console.log(err);
     }else{
       res.render("index",{blogs: blogs})
     }
   });
 })

 // New ROUTES
 app.get("/blogs/new",function(req,res){
   res.render("new");
 });
 //Create Routes
app.post("/blogs",function(req,res){
  req.body.blog.body = req.sanitize(req.body.blog.body);
  Blog.create(req.body.blog, function(err, newBlog){
    if(err){
      res.render("new");
    }else{
      res.redirect("/blogs");
    }
  });
});

//Show Page
app.get("/blogs/:id",function(req,res){
  Blog.findById(req.params.id,function(err, foundBlog){
    if(err){
      res.redirect("/blogs");
    }else{
      res.render("show", {blog: foundBlog});
    }
  });
});

// Edit ROUTE
app.get("/blogs/:id/edit", function(req,res){
  Blog.findById(req.params.id,function(err, foundBlog){
    if (err) {
      res.redirect("/blogs");
    }else{
      res.render("edit", {blog: foundBlog});
    }
  });
});

//Update
app.put("/blogs/:id", function(req,res){
  req.body.blog.body = req.sanitize(req.body.blog.body);
  Blog.findByIdAndUpdate(req.params.id,req.body.blog, function(err, updatedBlog){
    if(err){
      res.redirect("/blogs");
    }else{
      res.redirect("/blogs/" + req.params.id);
    }
  });
});

//Delete
app.delete("/blogs/:id/", function(req,res){
  Blog.findByIdAndRemove(req.params.id, function(err){
    if (err) {
      res.redirect("/blogs");
    }else{
      res.redirect("/blogs");
    }
  })
});

app.listen(3000,function(){
  console.log("Blog as Started");
});
