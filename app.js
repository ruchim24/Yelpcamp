var express = require("express"),
   app = express(),
   bodyParser = require("body-parser"),
   mongoose = require("mongoose"),
   Campground=require("./models/campground"),
   passport=require("passport"),
	flash = require("connect-flash"),
   LocalStrategy=require("passport-local"),
   methodOverride = require("method-override");	
   Comment=require("./models/comment"),
   User   =require("./models/user"),	
   seedDB=require("./seeds");

var commentRoutes    = require("./routes/comments"),
	campgroundRoutes = require("./routes/campgrounds"),
	authRoutes       = require("./routes/index");


mongoose.connect("mongodb://localhost:27017/yelp_camp", {useNewUrlParser: true, useUnifiedTopology: true});
app.use(bodyParser.urlencoded({extended:true}));




app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"))
console.log(__dirname);
app.use( methodOverride("_method"));
app.use(flash());
//seedDB();

app.use(require("express-session")({
		secret: "Hakuna Matata",
	    resave:false,
	    saveUninitialized: false
		}))

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

app.use("/",authRoutes);
app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);


app.listen(3000, function() { 
  console.log('Server listening on port 3000'  + this.address().port); 
});
